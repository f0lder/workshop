'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { IAppSettings } from '@/models/AppSettings'
import { updateSettings, resetSettings } from '@/app/admin/settings/actions'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

interface SettingsFormProps {
  initialSettings: IAppSettings
}

// Simple CSS spinner component
function Spinner() {
  return (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
  )
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        setError('')
        setSuccess('')
        
        await updateSettings(formData)
        setSuccess('Setările au fost actualizate cu succes!')
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000)
        
      } catch (error) {
        console.error('Error updating settings:', error)
        setError(error instanceof Error ? error.message : 'Failed to update settings')
      }
    })
  }

  async function handleReset() {
    if (!confirm('Sunteți sigur că doriți să resetați toate setările la valorile implicite?')) {
      return
    }

    startTransition(async () => {
      try {
        setError('')
        setSuccess('')
        
        await resetSettings()
        setSuccess('Setările au fost resetate la valorile implicite!')
        
        // Refresh the page after a short delay
        setTimeout(() => {
          router.refresh()
        }, 1500)
        
      } catch (error) {
        console.error('Error resetting settings:', error)
        setError(error instanceof Error ? error.message : 'Failed to reset settings')
      }
    })
  }

  return (
    <div className="p-6">
      <form action={handleSubmit} className="space-y-8">
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

        {/* Workshop Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Setări Workshop-uri
            </h3>
          </div>

          <div className="space-y-6">
            <ToggleSwitch
              name="globalRegistrationEnabled"
              label="Permite înregistrarea globală la workshop-uri"
              description="Când este activat, utilizatorii se pot înregistra la workshop-uri. Când este dezactivat, înregistrările sunt blocate global."
              defaultChecked={initialSettings.globalRegistrationEnabled}
            />

            <ToggleSwitch
              name="paymentsEnabled"
              label="Permite plățile pentru workshop-uri"
              description="Când este activat, utilizatorii pot efectua plăți pentru workshop-uri."
              defaultChecked={initialSettings.paymentsEnabled}
            />

            <ToggleSwitch
              name="workshopVisibleToPublic"
              label="Workshop-uri vizibile publicului"
              description="Când este activat, workshop-urile sunt vizibile publicului."
              defaultChecked={initialSettings.workshopVisibleToPublic}
            />

            <ToggleSwitch
              name="requireApprovalForRegistration"
              label="Necesită aprobare pentru înregistrări"
              description="Când este activat, înregistrările necesită aprobare manuală de la admin înainte de confirmare."
              defaultChecked={initialSettings.requireApprovalForRegistration}
            />

            <ToggleSwitch
              name="allowCancelRegistration"
              label="Permite anularea înregistrărilor"
              description="Când este activat, utilizatorii pot anula propriile înregistrări la workshop-uri."
              defaultChecked={initialSettings.allowCancelRegistration}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="maxWorkshopsPerUser" className="block text-sm font-medium text-foreground">
                Workshop-uri maxime per utilizator
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="maxWorkshopsPerUser"
                  min="1"
                  max="100"
                  defaultValue={initialSettings.maxWorkshopsPerUser}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="defaultMaxParticipants" className="block text-sm font-medium text-foreground">
                Participanți maximi implicit
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="defaultMaxParticipants"
                  min="1"
                  max="1000"
                  defaultValue={initialSettings.defaultMaxParticipants}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="defaultWorkshopDuration" className="block text-sm font-medium text-foreground">
                Durată implicită (minute)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="defaultWorkshopDuration"
                  min="30"
                  max="480"
                  step="30"
                  defaultValue={initialSettings.defaultWorkshopDuration}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Setări Email
            </h3>
          </div>

          <div className="space-y-6">
            <ToggleSwitch
              name="sendEmailNotifications"
              label="Trimite notificări prin email"
              description="Activează trimiterea de notificări prin email pentru diverse evenimente din platformă."
              defaultChecked={initialSettings.sendEmailNotifications}
            />

            <ToggleSwitch
              name="sendRegistrationConfirmation"
              label="Confirmări de înregistrare"
              description="Trimite email de confirmare când un utilizator se înregistrează la un workshop."
              defaultChecked={initialSettings.sendRegistrationConfirmation}
            />

            <ToggleSwitch
              name="sendCancellationNotification"
              label="Notificări de anulare"
              description="Trimite email de notificare când un utilizator anulează o înregistrare."
              defaultChecked={initialSettings.sendCancellationNotification}
            />
          </div>
        </div>

        {/* General Settings */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              Setări Generale
            </h3>
          </div>

          <div className="space-y-6">
            <ToggleSwitch
              name="maintenanceMode"
              label="Mod mentenanță"
              description="⚠️ Când este activat, blochează accesul utilizatorilor normali la platformă. Doar administratorii pot accesa aplicația."
              defaultChecked={initialSettings.maintenanceMode}
            />

            <div>
              <label htmlFor="registrationMessage" className="block text-sm font-medium text-foreground">
                Mesaj înregistrare
              </label>
              <div className="mt-1">
                <textarea
                  name="registrationMessage"
                  rows={3}
                  defaultValue={initialSettings.registrationMessage}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Mesajul afișat pe pagina de workshop-uri"
                />
              </div>
            </div>

            <div>
              <label htmlFor="footerText" className="block text-sm font-medium text-foreground">
                Text footer
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="footerText"
                  defaultValue={initialSettings.footerText}
                  className="block w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Text afișat în footer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-border">
          <button
            type="button"
            onClick={handleReset}
            disabled={isPending}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resetează la implicit
          </button>
          
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending && <Spinner />}
            {isPending ? 'Se salvează...' : 'Salvează setările'}
          </button>
        </div>
      </form>
    </div>
  )
}
