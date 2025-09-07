import { User as ClerkUser } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
import { User, IUser } from '@/models'

/**
 * Sync Clerk user with our database
 * This function ensures every Clerk user has a corresponding record in our MongoDB
 */
export async function syncUserWithDatabase(clerkUser: ClerkUser): Promise<any> {
  await connectDB()

  try {
    // First, check if user already exists to preserve their role
    const existingUser = await User.findOne({ clerkId: clerkUser.id }).lean() as any
    
    // Determine the role: use Clerk's publicMetadata if set, otherwise preserve existing role or default to 'user'
    const role = clerkUser.publicMetadata?.role || existingUser?.role || 'user'

    // Use findOneAndUpdate with upsert to avoid duplicate key errors
    const user = await User.findOneAndUpdate(
      { clerkId: clerkUser.id },
      {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        role: role, // Preserve existing role or use Clerk's metadata
      },
      {
        upsert: true, // Create if doesn't exist
        new: true,    // Return the updated document
        runValidators: true,
        lean: true    // Return plain object instead of Mongoose document
      }
    ) as any

    if (!user) {
      throw new Error('Failed to create or update user')
    }

    // Convert to plain object to ensure it's serializable
    return {
      _id: user._id.toString(),
      clerkId: user.clerkId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  } catch (error) {
    console.error('Error syncing user with database:', error)
    
    // If it's a duplicate key error, try to find the existing user
    if (error instanceof Error && error.message.includes('E11000')) {
      const existingUser = await User.findOne({ clerkId: clerkUser.id }).lean() as any
      if (existingUser) {
        return {
          _id: existingUser._id.toString(),
          clerkId: existingUser.clerkId,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role,
          createdAt: existingUser.createdAt,
          updatedAt: existingUser.updatedAt
        }
      }
    }
    
    throw error
  }
}

/**
 * Get user role from our database
 */
export async function getUserRole(clerkUserId: string): Promise<'user' | 'admin'> {
  await connectDB()
  
  const user = await User.findOne({ clerkId: clerkUserId })
  return user?.role || 'user'
}

/**
 * Check if user is admin
 */
export async function isUserAdmin(clerkUserId: string): Promise<boolean> {
  const role = await getUserRole(clerkUserId)
  return role === 'admin'
}
