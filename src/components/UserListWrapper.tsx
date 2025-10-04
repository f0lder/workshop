'use client'

import { useState, useCallback } from 'react'
import { User } from '@/types/models'
import UserList from './UserList'

interface UserListWrapperProps {
  initialUsers: User[]
  currentUserId: string
}

export default function UserListWrapper({ initialUsers, currentUserId }: UserListWrapperProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true)
      
      // Fetch updated user data
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const updatedUsers = await response.json()
      setUsers(updatedUsers)
    } catch (error) {
      console.error('Error refreshing users:', error)
      // Could add toast notification here
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  return (
    <div className="relative">
      {isRefreshing && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-lg">
          <div className="flex items-center space-x-2 bg-card px-4 py-2 rounded-lg border border-border shadow-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            <span className="text-sm text-muted-foreground">Se actualizează...</span>
          </div>
        </div>
      )}
      <UserList 
        users={users} 
        currentUserId={currentUserId} 
        onRefresh={handleRefresh}
      />
    </div>
  )
}