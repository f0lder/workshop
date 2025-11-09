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
    // Get all data in parallel for faster execution
    const [appSettings, workshop, existingRegistration] = await Promise.all([
      getAppSettings(),
      Workshop.findById(workshopId),
      Registration.findOne({ userId: clerkUser.id, workshopId })
    ])

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
      
      // Enforce maximum of 2 active "workshop" type registrations.
      // If the current workshop is a 'conferinta' type, allow unlimited registrations.
      if (workshop.wsType !== 'conferinta') {
        // Get the user's other registrations (exclude current workshop)
        const otherRegs = await Registration.find({
          userId: clerkUser.id,
          workshopId: { $ne: workshopId }
        }).lean()

        const otherWorkshopIds = otherRegs.map(r => r.workshopId)

        // Count how many of those registrations are for workshops of type 'workshop'
        let userWorkshopCount = 0
        if (otherWorkshopIds.length > 0) {
          userWorkshopCount = await Workshop.countDocuments({
            _id: { $in: otherWorkshopIds },
            wsType: 'workshop'
          })
        }

        if (userWorkshopCount >= 2) {
          throw new Error('Poți fi înregistrat la maxim 2 workshop-uri simultan')
        }
      }

      // Get current registration count for this workshop
      const currentRegistrations = await Registration.countDocuments({ workshopId })
      if (currentRegistrations >= workshop.maxParticipants) {
        throw new Error('Workshop is full')
      }

      // Perform registration and update count atomically
      await Promise.all([
        Registration.create({
          userId: clerkUser.id,
          workshopId,
          status: 'confirmed'
        }),
        Workshop.findByIdAndUpdate(workshopId, {
          currentParticipants: currentRegistrations + 1
        })
      ])

    } else if (action === 'cancel') {
      if (!appSettings.allowCancelRegistration) {
        throw new Error('Registration cancellation is not allowed')
      }

      if (!existingRegistration) {
        throw new Error('No registration found to cancel')
      }

      // Get current count and perform cancellation atomically
      const currentRegistrations = await Registration.countDocuments({ workshopId })
      
      await Promise.all([
        Registration.findOneAndDelete({ userId: clerkUser.id, workshopId }),
        Workshop.findByIdAndUpdate(workshopId, {
          currentParticipants: Math.max(0, currentRegistrations - 1)
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
    const registrations = await Registration.find({ userId }).lean()

    if (registrations.length === 0) {
      return []
    }

    // Get all workshop IDs from registrations
    const workshopIds = registrations.map((reg) => reg.workshopId);

    // Fetch all workshops at once
    const workshops = await Workshop.find({ _id: { $in: workshopIds } }).lean();

    const workshopMap = Object.fromEntries(
      workshops.map(workshop => [String(workshop._id), workshop])
    );

    // Combine registrations with workshops
    const registrationsWithWorkshops = registrations
      .filter((reg) => workshopMap[reg.workshopId])
      .map((reg) => ({
        _id: String(reg._id),
        userId: reg.userId,
        workshopId: reg.workshopId,
        workshop: workshopMap[reg.workshopId] as unknown as WorkshopType,
        attendance: reg.attendance || { confirmed: false }
      })) as registrationsWithWorkshops[];

    return registrationsWithWorkshops

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
    const workshops = await Workshop.find({}).sort({ date: 1 }).lean()
    return workshops as unknown as WorkshopType[]
  } catch (error) {
    console.error('Error fetching workshops:', error)
    return []
  }
}