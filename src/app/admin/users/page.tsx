import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isUserAdmin } from '@/lib/auth'
import UserListWrapper from '@/components/UserListWrapper'
import {fetchAllUsers} from './actions'

export default async function AdminUsersPage() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/auth/login')
  }

  const isUserAdminRole = await isUserAdmin(clerkUser.id)
  if (!isUserAdminRole) {
    redirect('/unauthorized')
  }

  const users = await fetchAllUsers();


  // Sort by creation date (newest first)
  users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

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
            Toți utilizatorii ({users.length})
          </h2>
        </div>
        <UserListWrapper initialUsers={users} currentUserId={clerkUser.id} />
      </div>
    </div>
  )
}
