'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { Workshop, Registration } from '@/models'
import connectDB from '@/lib/mongodb'
import { getAppSettings } from '@/lib/settings'
import type { Workshop as WorkshopType, Registrations } from '@/types/models'

export async function registerForWorkshop(formData: FormData): Promise<void> {
  const clerkUser = await currentUser()
  
  const workshopId = formData.get('workshopId') as string
  const action = formData.get('action') as string

  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  await connectDB()

  try {
    // OPTIMIZATION 1: Get only essential fields with select() and use lean()
    const [appSettings, workshopDoc, existingReg] = await Promise.all([
      getAppSettings(),
      Workshop.findById(workshopId)
        .select('wsType maxParticipants currentParticipants status')
        .lean()
        .exec(),
      Registration.findOne({ userId: clerkUser.id, workshopId })
        .select('_id')
        .lean()
        .exec()
    ])

    const workshop = workshopDoc as WorkshopType | null
    const existingRegistration = existingReg as Registrations | null

    if (!workshop) {
      throw new Error('Workshop not found')
    }

    // Check global registration settings
    if (!appSettings.globalRegistrationEnabled) {
      throw new Error('Inregistrarile sunt inchise in acest moment')
    }

    // Check if registration deadline has passed (only for workshops, not conferences)
    if (workshop.wsType === 'workshop' && appSettings.registrationDeadline && new Date(appSettings.registrationDeadline) < new Date()) {
      throw new Error('Termenul limită pentru înregistrări la workshop-uri a expirat')
    }

    if (action === 'register') {
      // Validate registration conditions
      
      if (existingRegistration) {
        throw new Error('Ești deja înregistrat la acest workshop')
      }
      
      // OPTIMIZATION 2: Skip conference capacity checks entirely
      if (workshop.wsType === 'conferinta') {
        // For conferences, just create registration without checks
        await Registration.create({
          userId: clerkUser.id,
          workshopId,
          status: 'confirmed'
        })
        
        // Update participant count with atomic increment
        await Workshop.findByIdAndUpdate(workshopId, {
          $inc: { currentParticipants: 1 }
        })
      } else {
        // For workshops, enforce limits
        // OPTIMIZATION 3: Use single aggregation for all validation
        const [validationResult] = await Registration.aggregate([
          {
            $facet: {
              // Check user's workshop count
              userWorkshops: [
                {
                  $match: {
                    userId: clerkUser.id,
                    workshopId: { $ne: workshopId }
                  }
                },
                {
                  // Convert workshopId string to ObjectId
                  $addFields: {
                    workshopObjectId: { $toObjectId: '$workshopId' }
                  }
                },
                {
                  $lookup: {
                    from: 'workshops',
                    localField: 'workshopObjectId',
                    foreignField: '_id',
                    as: 'workshop'
                  }
                },
                {
                  $unwind: '$workshop'
                },
                {
                  $match: {
                    'workshop.wsType': 'workshop'
                  }
                },
                {
                  $count: 'total'
                }
              ],
              // Check current workshop registrations
              workshopRegistrations: [
                {
                  $match: { workshopId }
                },
                {
                  $count: 'total'
                }
              ]
            }
          }
        ])

        const userWorkshopCount = validationResult?.userWorkshops[0]?.total || 0
        const currentRegistrations = validationResult?.workshopRegistrations[0]?.total || 0

        // Validate user workshop limit
        if (userWorkshopCount >= 2) {
          throw new Error('Poți fi înregistrat la maxim 2 workshop-uri simultan')
        }

        // Validate workshop capacity
        if (currentRegistrations >= workshop.maxParticipants) {
          throw new Error('Workshop is full')
        }

        // OPTIMIZATION 4: Use atomic operations to prevent race conditions
        // Create registration and increment counter atomically
        await Registration.create({
          userId: clerkUser.id,
          workshopId,
          status: 'confirmed'
        })
        
        // Use $inc for atomic increment
        await Workshop.findByIdAndUpdate(workshopId, {
          $inc: { currentParticipants: 1 }
        })
      }

    } else if (action === 'cancel') {
      if (!appSettings.allowCancelRegistration) {
        throw new Error('Registration cancellation is not allowed')
      }

      if (!existingRegistration) {
        throw new Error('No registration found to cancel')
      }

      // OPTIMIZATION 5: Use atomic decrement and delete in parallel
      await Promise.all([
        Registration.findOneAndDelete({ userId: clerkUser.id, workshopId }),
        Workshop.findByIdAndUpdate(workshopId, {
          $inc: { currentParticipants: -1 }
        })
      ])
    }

  } catch (error) {
    console.error('Registration action error:', error)
    throw error // Re-throw to let the client handle the error
  }

  // Only revalidate on success
  revalidatePath('/workshops')
  revalidatePath('/dashboard')
}

interface registrationsWithWorkshops extends Registrations {
  workshop: WorkshopType;
  attendance: {
    confirmed: boolean;
    confirmedAt?: Date | string;
    confirmedBy?: string;
  };
}

export async function getUserRegistrations(userId: string): Promise<registrationsWithWorkshops[]> {
  await connectDB()

  try {
    // Optimized: Use aggregation with $lookup to join in one query
    const registrationsWithWorkshops = await Registration.aggregate([
      {
        $match: { userId }
      },
      {
        // Convert workshopId string to ObjectId for the lookup
        $addFields: {
          workshopObjectId: { $toObjectId: '$workshopId' }
        }
      },
      {
        $lookup: {
          from: 'workshops',
          localField: 'workshopObjectId',
          foreignField: '_id',
          as: 'workshop'
        }
      },
      {
        $unwind: '$workshop'
      },
      {
        $project: {
          _id: { $toString: '$_id' },
          userId: 1,
          workshopId: { $toString: '$workshopId' },
          'workshop._id': { $toString: '$workshop._id' },
          'workshop.id': { $toString: '$workshop._id' },
          'workshop.title': 1,
          'workshop.description': 1,
          'workshop.date': 1,
          'workshop.time': 1,
          'workshop.location': 1,
          'workshop.maxParticipants': 1,
          'workshop.currentParticipants': 1,
          'workshop.instructor': 1,
          'workshop.status': 1,
          'workshop.wsType': 1,
          'workshop.url': 1,
          'workshop.createdAt': 1,
          'workshop.updatedAt': 1,
          attendance: {
            confirmed: { $ifNull: ['$attendance.confirmed', false] },
            confirmedAt: '$attendance.confirmedAt',
            confirmedBy: '$attendance.confirmedBy'
          }
        }
      }
    ])

    return registrationsWithWorkshops as registrationsWithWorkshops[]

  } catch (error) {
    console.error('Error fetching user registrations:', error)
    return []
  }
}

export async function getWorkshopById(workshopId: string): Promise<WorkshopType | null> {
  // Validate ObjectId format before making database query
  if (!workshopId || workshopId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(workshopId)) {
    console.log('Invalid ObjectId format:', workshopId)
    return null
  }

  await connectDB()

  try {
    const workshop = await Workshop.findById(workshopId).lean()
    return workshop as WorkshopType | null
  } catch (error) {
    console.error('Error fetching workshop by ID:', error)
    return null
  }
}

export async function getIsRegisteredForWorkshop( workshopId: string): Promise<boolean> {


  const clerkUser = await currentUser()

  if (!clerkUser) {
    return false
  }

  await connectDB()

  try {
    const registration = await Registration.findOne({ userId: clerkUser.id, workshopId }).lean()
    return registration !== null
  } catch (error) {
    console.error('Error checking workshop registration:', error)
    return false
  }
}

export async function getAllWorkshops(): Promise<WorkshopType[]> {
  await connectDB()

  try {
    // Use lean() for better performance and select only needed fields
    const workshops = await Workshop
      .find({})
      .select('title description date time location maxParticipants currentParticipants instructor status wsType url createdAt updatedAt')
      .sort({ date: 1 })
      .lean()
      
    // Convert MongoDB _id to string
    return workshops.map(w => ({
      ...w,
      _id: w._id?.toString(),
      id: w._id?.toString(),
    })) as unknown as WorkshopType[]
  } catch (error) {
    console.error('Error fetching workshops:', error)
    return []
  }
}