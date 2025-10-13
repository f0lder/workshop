'use client'

import { useState, useTransition } from 'react'
import { FaUser, FaCrown, FaEdit, FaSave, FaTrash, FaEllipsisV, FaClipboardCheck, FaQrcode, FaTimes } from 'react-icons/fa'
import { updateUserRole, deleteUser } from '@/app/admin/users/actions'
import { User, UserType } from '@/types/models'
import { useRouter } from 'next/navigation'
import SimpleUserQRCode from './SimpleUserQRCode'

interface UserListProps {
  users: User[]
  currentUserId: string
  onRefresh?: () => Promise<void>
}

function Spinner() {
  return (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
  )
}

export default function UserList({ users, currentUserId, onRefresh }: UserListProps) {
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)
  const [qrPopupUserId, setQrPopupUserId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{
    role: 'user' | 'admin',
    userType: UserType | '',
    accessLevel: string
  }>({ role: 'user', userType: '', accessLevel: 'unpaid' })
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const router = useRouter()

  const handleEdit = (user: User) => {
    setEditingUserId(user.clerkId)
    setEditData({
      role: user.role,
      userType: user.userType || '',
      accessLevel: user.accessLevel || 'unpaid'
    })
    setMessage('')
    setError('')
  }

  const handleSave = async (userId: string) => {
    startTransition(async () => {
      try {
        setError('')
        const formData = new FormData()
        formData.append('userId', userId)
        formData.append('role', editData.role)
        formData.append('userType', editData.userType)
        formData.append('accessLevel', editData.accessLevel)

        const result = await updateUserRole(formData)
        setMessage(result.message)
        setEditingUserId(null)

        // Refresh the component data
        if (onRefresh) {
          await onRefresh()
        }

      } catch (err) {
        console.error('Error updating user:', err)
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

        // Refresh the component data
        if (onRefresh) {
          await onRefresh()
        }
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

  const handleAttendancePage = (userId: string) => {
    setDropdownOpen(null)
    router.push(`/admin/attendance/${userId}`)
  }

  const handleShowQR = (userId: string) => {
    setDropdownOpen(null)
    setQrPopupUserId(userId)
  }

  const closeQRPopup = () => {
    setQrPopupUserId(null)
  }

  const toggleDropdown = (userId: string) => {
    setDropdownOpen(dropdownOpen === userId ? null : userId)
  }

  const closeDropdown = () => {
    setDropdownOpen(null)
  }

  const formatDate = (date: Date | number | null) => {
    if (!date) return 'Niciodată'
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDisplayName = (user: User) => {
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
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Utilizator
              </th>
              <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rol
              </th>
              <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Înregistrat
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tip cont
              </th>
              <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nivel Access
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {users.map((user) => {
              const isCurrentUser = user.clerkId === currentUserId
              return (
                <tr key={user.clerkId} className={`hover:bg-muted/50 ${isCurrentUser ? 'bg-blue-50/10 border-l-4 border-l-blue-500' : ''}`}>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-muted flex items-center justify-center">
                          <FaUser className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-foreground flex items-center">
                          <span className="truncate">{getDisplayName(user)}</span>
                          {isCurrentUser && (
                            <span className="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 flex-shrink-0">
                              Tu
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground truncate sm:hidden">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{user.email}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                      {user.role === 'admin' && <FaCrown className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />}
                      <span className="hidden sm:inline">{user.role === 'admin' ? 'Administrator' : 'Utilizator'}</span>
                      <span className="sm:hidden">{user.role === 'admin' ? 'Admin' : 'User'}</span>
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {user.userType || 'N/A'}
                  </td>

                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {user.accessLevel || 'N/A'}
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-sm text-muted-foreground">
                    {editingUserId === user.clerkId ? (
                      <div className="relative">
                        <div className="absolute right-0 top-0 z-20 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-lg p-4">
                          <h3 className="text-sm font-semibold text-foreground mb-3">Editează utilizator</h3>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium text-muted-foreground mb-1">Rol</label>
                              <select
                                value={editData.role}
                                onChange={(e) => setEditData({...editData, role: e.target.value as 'user' | 'admin'})}
                                className="w-full text-sm border border-input bg-background rounded px-2 py-1"
                                disabled={isPending}
                              >
                                <option value="user">Utilizator</option>
                                <option value="admin">Administrator</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-muted-foreground mb-1">Tip utilizator</label>
                              <select
                                value={editData.userType}
                                onChange={(e) => setEditData({...editData, userType: e.target.value as UserType})}
                                className="w-full text-sm border border-input bg-background rounded px-2 py-1"
                                disabled={isPending}
                              >
                                <option value="">Selectează tip</option>
                                <option value="student">Student</option>
                                <option value="elev">Elev</option>
                                <option value="rezident">Rezident</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-muted-foreground mb-1">Nivel acces</label>
                              <select
                                value={editData.accessLevel}
                                onChange={(e) => setEditData({...editData, accessLevel: e.target.value})}
                                className="w-full text-sm border border-input bg-background rounded px-2 py-1"
                                disabled={isPending}
                              >
                                <option value="unpaid">Neplătit</option>
                                <option value="paid">Plătit</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 mt-4">
                            <button
                              onClick={() => handleSave(user.clerkId)}
                              disabled={isPending}
                              className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 disabled:opacity-50 flex items-center"
                            >
                              {isPending ? <Spinner /> : <FaSave className="h-3 w-3 mr-1" />}
                              Salvează
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              disabled={isPending}
                              className="px-3 py-1 bg-muted text-foreground text-sm rounded hover:bg-muted/80 disabled:opacity-50"
                            >
                              Anulează
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : deletingUserId === user.clerkId ? (
                      <div className="relative">
                        <div className="absolute right-0 top-0 z-10 w-64 sm:w-80 bg-card border border-red-200 rounded-lg shadow-lg p-3 sm:p-4">
                          <div className="flex items-center mb-2 sm:mb-3">
                            <FaTrash className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mr-2" />
                            <h3 className="text-xs sm:text-sm font-semibold text-red-800">Confirmare ștergere</h3>
                          </div>
                          <p className="text-xs sm:text-sm text-foreground mb-3 sm:mb-4">
                            Sigur doriți să ștergeți utilizatorul <strong>{getDisplayName(user)}</strong>?<br />
                            <span className="text-red-600">Această acțiune nu poate fi anulată!</span>
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => confirmDeleteUser(user.clerkId)}
                              disabled={isPending}
                              className="px-2 sm:px-3 py-1 sm:py-2 bg-red-600 text-white text-xs sm:text-sm rounded hover:bg-red-700 disabled:opacity-50 flex items-center"
                            >
                              {isPending ? (
                                <>
                                  <Spinner />
                                  <span className="ml-1 sm:ml-2 hidden sm:inline">Se șterge...</span>
                                </>
                              ) : (
                                <>
                                  <FaTrash className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                  <span className="hidden sm:inline">Șterge definitiv</span>
                                  <span className="sm:hidden">Șterge</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={cancelDeleteUser}
                              disabled={isPending}
                              className="px-2 sm:px-3 py-1 sm:py-2 bg-muted text-foreground text-xs sm:text-sm rounded hover:bg-muted/80 disabled:opacity-50"
                            >
                              Anulează
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`px-1.5 sm:px-2 py-1 text-xs rounded ${user._id ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                          <span className="hidden sm:inline">{user._id ? 'Sincronizat' : 'Doar în Clerk'}</span>
                          <span className="sm:hidden">{user._id ? 'Sync' : 'Clerk'}</span>
                        </span>
                        
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(user.clerkId)}
                            disabled={isPending || editingUserId !== null || deletingUserId !== null}
                            className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Acțiuni"
                          >
                            <FaEllipsisV className="h-4 w-4" />
                          </button>
                          
                          {dropdownOpen === user.clerkId && (
                            <>
                              {/* Backdrop to close dropdown */}
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={closeDropdown}
                              />
                              <div className="absolute right-0 top-8 z-20 w-48 bg-card border border-border rounded-lg shadow-lg py-1">
                                <button
                                  onMouseDown={() => {
                                    handleEdit(user)
                                    closeDropdown()
                                  }}
                                  disabled={isCurrentUser}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isCurrentUser ? 'text-muted-foreground' : 'text-foreground'
                                  }`}
                                >
                                  <FaEdit className="h-3 w-3 mr-2" />
                                  Editează
                                </button>
                                
                                <button
                                  onMouseDown={() => handleAttendancePage(user.clerkId)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center text-foreground"
                                >
                                  <FaClipboardCheck className="h-3 w-3 mr-2" />
                                  Prezență
                                </button>
                                
                                <button
                                  onMouseDown={() => handleShowQR(user.clerkId)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center text-foreground"
                                >
                                  <FaQrcode className="h-3 w-3 mr-2" />
                                  Cod QR
                                </button>
                                
                                <button
                                  onMouseDown={() => {
                                    handleDeleteUser(user.clerkId)
                                    closeDropdown()
                                  }}
                                  disabled={isCurrentUser}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isCurrentUser ? 'text-muted-foreground' : 'text-red-600 hover:text-red-800'
                                  }`}
                                >
                                  <FaTrash className="h-3 w-3 mr-2" />
                                  Șterge
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nu au fost găsiți utilizatori.</p>
        </div>
      )}

      {/* QR Code Popup Modal */}
      {qrPopupUserId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="mimesiss-card max-w-lg w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={closeQRPopup}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors z-10 p-1 rounded-full hover:bg-muted"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            
            {/* QR Code Content */}
            <div className="pt-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Cod QR pentru {(() => {
                    const user = users.find(u => u.clerkId === qrPopupUserId);
                    return user ? getDisplayName(user) : 'Utilizator';
                  })()}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Scanează pentru a confirma prezența
                </p>
              </div>
              
              {/* Only render QR component when popup is open */}
              <SimpleUserQRCode 
                userId={qrPopupUserId} 
                userName={(() => {
                  const user = users.find(u => u.clerkId === qrPopupUserId);
                  return user ? getDisplayName(user) : undefined;
                })()} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
