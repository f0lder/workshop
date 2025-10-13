'use client'

import { useState, useTransition, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { FaSave, FaEnvelope, FaUser } from 'react-icons/fa'
import { updateProfile } from './actions'
import { UserType } from '@/types/models'
import { useMongoUser } from '@/hooks/useMongoUser'

export default function ProfilePage() {
  const { isLoaded, user } = useUser()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userType, setUserType] = useState<UserType>('student')
  const [accessLevel, setAccessLevel] = useState('unpaid')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const { user: mongoUser, isLoading: isMongoUserLoading, error: mongoUserError, refetch } = useMongoUser()

  // Update state when user data loads - ALWAYS call this hook
  useEffect(() => {
    if (user && mongoUser) {
      setFirstName(mongoUser.firstName ?? '')
      setLastName(mongoUser.lastName ?? '')
      setUserType((mongoUser.userType as UserType | undefined) ?? 'student')
      setAccessLevel(mongoUser.accessLevel ?? 'unpaid')
    }
  }, [user, mongoUser])

  // Handle loading state AFTER all hooks are called
  if (isMongoUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span className="text-muted-foreground">Se încarcă profilul...</span>
        </div>
      </div>
    )
  }

  // Handle error state
  if (!mongoUser && mongoUserError) {
    console.error('Error loading MongoDB user data:', mongoUserError)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 mb-2">Eroare la încărcarea datelor</div>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setError('')
        setMessage('')

        const result = await updateProfile(formData)
        setMessage(result.message)

        // Force refresh user data
        await user?.reload()

      } catch (err) {
        console.error('Error updating profile:', err)
        setError(err instanceof Error ? err.message : 'A apărut o eroare la actualizarea profilului.')
      }
    })
  }

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="bg-card shadow border border-border rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-6"></div>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="bg-card shadow border border-border rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-destructive">Nu s-a putut încărca informațiile utilizatorului.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-card shadow border border-border rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Profilul meu
          </h1>
          <p className="text-muted-foreground">
            Actualizați informațiile contului dumneavoastră.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-card shadow border border-border rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form action={handleSubmit} className="space-y-6">
            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Email (read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Adresa de email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={user.emailAddresses[0]?.emailAddress || ''}
                  disabled
                  className="block w-full pl-10 pr-3 py-2 border border-input bg-muted rounded-md shadow-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Adresa de email nu poate fi modificată din această pagină.
              </p>
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                Prenume
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Introduceți prenumele"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                Nume
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Introduceți numele"
              />
            </div>


            {/* User Type */}
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-foreground mb-2">
                Schimba tip utilizator in (Curent: {userType})
              </label>
              <select
                id="userType"
                name="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value as UserType)}
                className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="student">Student</option>
                <option value="elev">Elev</option>
                <option value="rezident">Rezident</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Se salvează...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 h-4 w-4" />
                    Salvează modificările
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-card shadow border border-border rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-foreground mb-4">
            Informații cont
          </h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Data înregistrării
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ro-RO') : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Ultima actualizare
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('ro-RO') : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Tip utilizator
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {userType === 'student' && 'Student'}
                {userType === 'elev' && 'Elev'}
                {userType === 'rezident' && 'Rezident'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Nivel acces
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {accessLevel ?? 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
