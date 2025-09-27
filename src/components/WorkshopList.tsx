'use client'

import { WorkshopRegistrationButton } from '@/components/WorkshopRegistrationButton'
import { Workshop } from '@/types/models'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function WorkshopList({ isGlobalRegistrationClosed }: { isGlobalRegistrationClosed: boolean }) {
  const { user, isLoaded } = useUser()
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('/api/workshops')
      if (!response.ok) {
        throw new Error('Failed to fetch workshops')
      }
      const data = await response.json()
      setWorkshops(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workshops')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkshops()
  }, [])

  // Function to optimistically update workshop registration status
  const updateWorkshopRegistration = (workshopId: string, isRegistered: boolean) => {
    setWorkshops(prev => prev.map(workshop => {
      if ((workshop.id || workshop._id) === workshopId) {
        return {
          ...workshop,
          user_registered: isRegistered,
          currentParticipants: isRegistered
            ? (workshop.currentParticipants || 0) + 1
            : Math.max(0, (workshop.currentParticipants || 0) - 1)
        }
      }
      return workshop
    }))
  }

  if (loading || !isLoaded) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="mimesiss-section-card animate-pulse">
            <div className="p-6">
              <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded mb-4 w-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className="mt-6 h-10 bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
        >
          Reîncarcă
        </button>
      </div>
    )
  }
  if (workshops.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {/* Medical Section */}
        <div className="mimesiss-section-card border-l-4 border-border">
          <div className="bg-gradient-to-r from-secondary to-secondary/80 p-4 text-white">
            <h3 className="text-xl font-semibold">Secțiunea Medical</h3>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground mb-4">
              Prezentări de lucrări științifice în domeniul medicinei generale, 
              cercetare medicală și studii clinice.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span>Program va fi anunțat</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.97 2.97 0 0 0 17.15 7H16c-.8 0-1.5.31-2.04.81L12.5 9.5v3l2.5-1.5v5.5H9V9c0-.83-.34-1.58-.88-2.12l-3-3A.996.996 0 0 0 4 4c-.55 0-1 .45-1 1s.45 1 1 1c.28 0 .53-.11.71-.29L6 7v6c0 1.1.9 2 2 2h6v7h4z"/>
                </svg>
                <span>Participanți activi cu abstract</span>
              </div>
            </div>
            <div className="mt-6">
              <button className="mimesiss-btn-card">
                Înregistrează-te ca participant activ
              </button>
            </div>
          </div>
        </div>

        {/* Military Medical Section */}
        <div className="mimesiss-section-card border-l-4 border-border">
          <div className="bg-gradient-to-r from-accent to-accent/80 p-4 text-white">
            <h3 className="text-xl font-semibold">Secțiunea Medico-Militară</h3>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground mb-4">
              Lucrări specializate în medicina militară, medicină de urgență 
              în conflict și îngrijirea personalului militar.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span>Program va fi anunțat</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.97 2.97 0 0 0 17.15 7H16c-.8 0-1.5.31-2.04.81L12.5 9.5v3l2.5-1.5v5.5H9V9c0-.83-.34-1.58-.88-2.12l-3-3A.996.996 0 0 0 4 4c-.55 0-1 .45-1 1s.45 1 1 1c.28 0 .53-.11.71-.29L6 7v6c0 1.1.9 2 2 2h6v7h4z"/>
                </svg>
                <span>Participanți activi cu abstract</span>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2 px-4 rounded-md transition duration-200">
                Înregistrează-te ca participant activ
              </button>
            </div>
          </div>
        </div>

        {/* E-Poster Section */}
        <div className="mimesiss-section-card border-l-4 border-border">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
            <h3 className="text-xl font-semibold">Secțiunea E-Poster</h3>
          </div>
          <div className="p-6">
            <p className="text-muted-foreground mb-4">
              Prezentări în format digital, poster interactiv cu discuții 
              și sesiuni de întrebări și răspunsuri.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                <span>Program va fi anunțat</span>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.97 2.97 0 0 0 17.15 7H16c-.8 0-1.5.31-2.04.81L12.5 9.5v3l2.5-1.5v5.5H9V9c0-.83-.34-1.58-.88-2.12l-3-3A.996.996 0 0 0 4 4c-.55 0-1 .45-1 1s.45 1 1 1c.28 0 .53-.11.71-.29L6 7v6c0 1.1.9 2 2 2h6v7h4z"/>
                </svg>
                <span>Participanți activi cu poster</span>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-2 px-4 rounded-md transition duration-200">
                Înregistrează-te ca participant activ
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workshops.map((workshop) => (
        <div key={workshop.id} className="mimesiss-section-card">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {workshop.title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {workshop.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                {new Date(workshop.date).toLocaleDateString('ro-RO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                {workshop.time || 'Ora va fi anunțată'}
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {workshop.location}
              </div>

              <div className="flex items-center text-sm text-muted-foreground">
                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.97 2.97 0 0 0 17.15 7H16c-.8 0-1.5.31-2.04.81L12.5 9.5v3l2.5-1.5v5.5H9V9c0-.83-.34-1.58-.88-2.12l-3-3A.996.996 0 0 0 4 4c-.55 0-1 .45-1 1s.45 1 1 1c.28 0 .53-.11.71-.29L6 7v6c0 1.1.9 2 2 2h6v7h4z"/>
                </svg>
                {(workshop.currentParticipants || 0)} / {workshop.maxParticipants || 0} participanți
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Instructor: <span className="font-medium text-foreground">{workshop.instructor}</span>
              </p>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.max(0, ((workshop.currentParticipants || 0) / (workshop.maxParticipants || 1)) * 100))}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <span className="ml-3 text-xs text-muted-foreground">
                  {Math.round(((workshop.currentParticipants || 0) / (workshop.maxParticipants || 1)) * 100)}% complet
                </span>
              </div>
            </div>

            <div className="mt-6">
              {user ? (
                <WorkshopRegistrationButton 
                  workshop={{
                    ...workshop,
                    _id: workshop.id || workshop._id,
                    date: typeof workshop.date === 'string' ? new Date(workshop.date) : workshop.date,
                  } as Workshop} 
                  onOptimisticUpdate={updateWorkshopRegistration}
                  isGlobalRegistrationClosed={isGlobalRegistrationClosed} // Pass global registration status if needed
                />
              ) : (
                <Link
                  href="/auth/signup"
                  className="w-full block text-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Înregistrează-te pentru workshop
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
