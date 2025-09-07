'use client'

import { useState, useTransition } from 'react'
import { FaUser, FaCrown, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa'
import Image from 'next/image'
import { updateUserRole, deleteUser } from '@/app/admin/users/actions'

interface CombinedUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'user' | 'admin'
  createdAt: number
  lastSignInAt: number | null
  imageUrl: string
  mongoId?: string
}

interface UserListProps {
  users: CombinedUser[]
  currentUserId: string
}

function Spinner() {
  return (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
  )
}

export default function UserList({ users, currentUserId }: UserListProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleEditRole = (userId: string, currentRole: 'user' | 'admin') => {
    setEditingUserId(userId)
    setNewRole(currentRole)
    setMessage('')
    setError('')
  }

  const handleSaveRole = async (userId: string) => {
    startTransition(async () => {
      try {
        setError('')
        const formData = new FormData()
        formData.append('userId', userId)
        formData.append('role', newRole)
        
        const result = await updateUserRole(formData)
        setMessage(result.message)
        setEditingUserId(null)
        
        // Refresh the page to show updated data
        window.location.reload()
      } catch (err) {
        console.error('Error updating user role:', err)
        setError(err instanceof Error ? err.message : 'A apărut o eroare.')
      }
    })
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setMessage('')
    setError('')
  }

  const handleDeleteUser = (userId: string) => {
    setDeletingUserId(userId)
    setMessage('')
    setError('')
  }

  const confirmDeleteUser = async (userId: string) => {
    startTransition(async () => {
      try {
        setError('')
        const formData = new FormData()
        formData.append('userId', userId)
        
        const result = await deleteUser(formData)
        setMessage(result.message)
        setDeletingUserId(null)
        
        // Refresh the page to show updated data
        window.location.reload()
      } catch (err) {
        console.error('Error deleting user:', err)
        setError(err instanceof Error ? err.message : 'A apărut o eroare.')
      }
    })
  }

  const cancelDeleteUser = () => {
    setDeletingUserId(null)
    setMessage('')
    setError('')
  }

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Niciodată'
    return new Date(timestamp).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDisplayName = (user: CombinedUser) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName} ${user.lastName}`.trim()
    }
    return user.email.split('@')[0]
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">{message}</p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Utilizator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Înregistrat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ultima autentificare
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUserId
              return (
              <tr key={user.id} className={`hover:bg-muted/50 ${isCurrentUser ? 'bg-blue-50/10 border-l-4 border-l-blue-500' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {user.imageUrl ? (
                        <Image 
                          className="h-10 w-10 rounded-full" 
                          src={user.imageUrl} 
                          alt=""
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <FaUser className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground flex items-center">
                        {getDisplayName(user)}
                        {isCurrentUser && (
                          <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                            Tu
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {user.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUserId === user.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
                        className="text-sm border border-input bg-background rounded px-2 py-1"
                        disabled={isPending}
                      >
                        <option value="user">Utilizator</option>
                        <option value="admin">Administrator</option>
                      </select>
                      <button
                        onClick={() => handleSaveRole(user.id)}
                        disabled={isPending}
                        className="text-green-600 hover:text-green-800 disabled:opacity-50"
                      >
                        {isPending ? <Spinner /> : <FaSave className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isPending}
                        className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {user.role === 'admin' && <FaCrown className="h-3 w-3 mr-1" />}
                        {user.role === 'admin' ? 'Administrator' : 'Utilizator'}
                      </span>
                      <button
                        onClick={() => handleEditRole(user.id, user.role)}
                        disabled={isPending || deletingUserId !== null || isCurrentUser}
                        className={`disabled:opacity-50 disabled:cursor-not-allowed ${
                          isCurrentUser 
                            ? 'text-muted-foreground' 
                            : 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                        }`}
                        title={isCurrentUser ? 'Nu vă puteți modifica propriul rol' : 'Editează rol'}
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(user.lastSignInAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {deletingUserId === user.id ? (
                    <div className="relative">
                      <div className="absolute right-0 top-0 z-10 w-80 bg-card border border-red-200 rounded-lg shadow-lg p-4">
                        <div className="flex items-center mb-3">
                          <FaTrash className="h-5 w-5 text-red-600 mr-2" />
                          <h3 className="text-sm font-semibold text-red-800">Confirmare ștergere</h3>
                        </div>
                        <p className="text-sm text-foreground mb-4">
                          Sigur doriți să ștergeți utilizatorul <strong>{getDisplayName(user)}</strong>?<br />
                          <span className="text-red-600">Această acțiune nu poate fi anulată!</span>
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => confirmDeleteUser(user.id)}
                            disabled={isPending}
                            className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
                          >
                            {isPending ? (
                              <>
                                <Spinner />
                                <span className="ml-2">Se șterge...</span>
                              </>
                            ) : (
                              <>
                                <FaTrash className="h-3 w-3 mr-1" />
                                Șterge definitiv
                              </>
                            )}
                          </button>
                          <button
                            onClick={cancelDeleteUser}
                            disabled={isPending}
                            className="px-3 py-2 bg-muted text-foreground text-sm rounded hover:bg-muted/80 disabled:opacity-50"
                          >
                            Anulează
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        user.mongoId ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {user.mongoId ? 'Sincronizat' : 'Doar în Clerk'}
                      </span>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={isPending || editingUserId !== null || isCurrentUser}
                        className={`p-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                          isCurrentUser 
                            ? 'text-muted-foreground' 
                            : 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                        }`}
                        title={isCurrentUser ? 'Nu vă puteți șterge propriul cont' : 'Șterge utilizator'}
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nu au fost găsiți utilizatori.</p>
        </div>
      )}
    </div>
  )
}
