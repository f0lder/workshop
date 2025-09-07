import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import connectDB from '@/lib/mongodb'
import { User } from '@/models'
import { isUserAdmin } from '@/lib/auth'
import { clerkClient } from '@clerk/nextjs/server'
import UserList from '@/components/UserList'

export default async function AdminUsersPage() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/auth/login')
  }

  const isUserAdminRole = await isUserAdmin(clerkUser.id)
  if (!isUserAdminRole) {
    redirect('/unauthorized')
  }

  // Get users from MongoDB
  await connectDB()
  const mongoUsers = await User.find({}).lean()

  // Get all users from Clerk
  const clerkUsers = await (await clerkClient()).users.getUserList({
    limit: 500, // Adjust as needed
  })

  // Combine Clerk and MongoDB data
  const combinedUsers = clerkUsers.data.map((clerkUser) => {
    const mongoUser = mongoUsers.find((u: any) => u.clerkId === clerkUser.id)
    
    return {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      role: mongoUser?.role || 'user',
      createdAt: clerkUser.createdAt,
      lastSignInAt: clerkUser.lastSignInAt,
      imageUrl: clerkUser.imageUrl,
      mongoId: mongoUser?._id?.toString(),
    }
  })

  // Sort by creation date (newest first)
  combinedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestionare utilizatori</h1>
          <p className="text-muted-foreground">
            Vizualizați și gestionați utilizatorii înregistrați
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Toți utilizatorii ({combinedUsers.length})
          </h2>
        </div>
        <UserList users={combinedUsers} currentUserId={clerkUser.id} />
      </div>
    </div>
  )
}
