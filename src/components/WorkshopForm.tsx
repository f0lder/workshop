'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createWorkshop, updateWorkshop } from '@/app/admin/workshops/actions'
import type { IAppSettings } from '@/models/AppSettings'

interface WorkshopFormProps {
  mode: 'create' | 'edit'
  defaultSettings?: IAppSettings
  workshop?: {
    id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    maxParticipants: number
    currentParticipants: number
    instructor: string
    status: string
    registrationStatus: 'open' | 'closed'
  }
}

// Simple CSS spinner component
function Spinner() {
  return (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
  )
}

export default function WorkshopForm({ mode, workshop, defaultSettings }: WorkshopFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const isEdit = mode === 'edit'
  const title = isEdit ? 'Editează Workshop' : 'Creează Workshop Nou'
  const submitText = isEdit ? 'Actualizează Workshop' : 'Creează Workshop'
  const loadingText = isEdit ? 'Se actualizează...' : 'Se creează...'
  const successMessage = isEdit ? 'Workshop actualizat cu succes!' : 'Workshop creat cu succes!'

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        setError('')
        setSuccess('')
        
        if (isEdit && workshop) {
          await updateWorkshop(workshop.id, formData)
        } else {
          await createWorkshop(formData)
        }
        
        setSuccess(successMessage)
        
        // Redirect back to admin workshops page after a short delay
        setTimeout(() => {
          router.push('/admin/workshops')
        }, 1500)
        
      } catch (error) {
        console.error(`Error ${isEdit ? 'updating' : 'creating'} workshop:`, error)
        setError(error instanceof Error ? error.message : `Failed to ${isEdit ? 'update' : 'create'} workshop`)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isEdit ? 'Modificați informațiile workshop-ului.' : 'Completați informațiile pentru noul workshop.'}
        </p>
      </div>

      <div className="bg-card shadow border border-border sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                Titlu Workshop *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  defaultValue={workshop?.title || ''}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="ex. Introducere în React"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground">
                Descriere *
              </label>
              <div className="mt-1">
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  defaultValue={workshop?.description || ''}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Descrieți ce vor învăța participanții..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-foreground">
                  Data *
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    defaultValue={workshop?.date || ''}
                    className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-foreground">
                  Ora *
                </label>
                <div className="mt-1">
                  <input
                    type="time"
                    name="time"
                    id="time"
                    required
                    defaultValue={workshop?.time || ''}
                    className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-foreground">
                Locație *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  defaultValue={workshop?.location || ''}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="ex. Sala de conferințe A, Online"
                />
              </div>
            </div>

            <div>
              <label htmlFor="instructor" className="block text-sm font-medium text-foreground">
                Instructor *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="instructor"
                  id="instructor"
                  required
                  defaultValue={workshop?.instructor || ''}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Numele instructorului"
                />
              </div>
            </div>

            <div>
              <label htmlFor="registrationStatus" className="block text-sm font-medium text-foreground">
                Status înregistrări *
              </label>
              <div className="mt-1">
                <select
                  name="registrationStatus"
                  id="registrationStatus"
                  defaultValue={workshop?.registrationStatus || 'open'}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="open">Deschise - participanții se pot înregistra</option>
                  <option value="closed">Închise - înregistrările sunt oprite</option>
                </select>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Controlează dacă participanții se pot înregistra la acest workshop.
              </p>
            </div>

            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-foreground">
                Numărul maxim de participanți *
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="maxParticipants"
                  id="maxParticipants"
                  required
                  min={isEdit && workshop ? workshop.currentParticipants : 1}
                  max="100"
                  defaultValue={workshop?.maxParticipants || defaultSettings?.defaultMaxParticipants || 20}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {isEdit && workshop 
                  ? `Valoare minimă: ${workshop.currentParticipants} (participanți actuali)`
                  : `Numărul maxim de participanți permis pentru acest workshop. Implicit: ${defaultSettings?.defaultMaxParticipants || 20}`
                }
              </p>
            </div>

            {isEdit && workshop && (
              <div className="bg-muted p-4 rounded-md">
                <h4 className="text-sm font-medium text-foreground mb-2">Workshop Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current Participants:</span>
                    <span className="ml-2 font-medium">{workshop.currentParticipants}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <span className="ml-2 font-medium capitalize">{workshop.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Instructor:</span>
                    <span className="ml-2 font-medium">{workshop.instructor}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/workshops"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium"
              >
                Anulează
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending && <Spinner />}
                {isPending ? loadingText : submitText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
