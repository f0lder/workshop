import Link from 'next/link'
import WorkshopList from '@/components/WorkshopList'
import { Suspense } from 'react'
import { getAppSettings } from '@/lib/settings'
import HeaderContent from '@/components/HeaderContent'
import { FaCircle } from 'react-icons/fa'

// Force dynamic rendering since we're fetching data from database
export const dynamic = 'force-dynamic'

// Skeleton loader for the workshop list
function WorkshopListSkeleton() {
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

export default async function WorkshopsPage() {

  const appSettings = await getAppSettings()
  const workshopVisibleToPublic = appSettings?.workshopVisibleToPublic || false

  return (
    <>
      {/* Main Content */}
      <HeaderContent title="Ateliere MIMESISS 2025" />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="mimesiss-section-header">
            <h1 className="text-3xl font-bold mb-2">Programul MIMESISS 2025</h1>
            <p className="mimesiss-text-secondary text-lg">
              Sesiunea de Comunicări Științifice Medico-Militare pentru Studenți
            </p>
            <div className="mt-4 flex items-center space-x-6">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <span>13-16 Noiembrie 2025</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>Spitalul militar central &ldquo;Dr. Carol Davila&rdquo;</span>
              </div>
            </div>
          </div>

          {/* Workshop List with Loading */}
          <Suspense fallback={<WorkshopListSkeleton />}>
            <WorkshopList workshopVisibleToPublic={workshopVisibleToPublic} />
          </Suspense>

          {/* Info Section */}
          <div className="border border-primary rounded-lg p-6 space-y-8">
            <h3 className="text-lg font-semibold text-white">
              Informații importante despre înregistrare
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="border-none lg:border-r border-gray-700 pr-4">
                <h4 className="font-medium mb-2">Participanți pasivi <span> 170 RON </span></h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Acces la toate conferințele</li>
                  <li>Materiale de curs incluse</li>
                  <li>Certificat de participare</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Participanți activi <span> 120 RON </span></h4>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Toate beneficiile participanților pasivi</li>
                  <li>Prezentare lucrare științifică</li>
                  <li>Șanse de câștigare a premiilor</li>
                </ul>
              </div>
            </div>
            <div className="text-primary">
              <Link 
                href="/info" 
                className="inline-flex items-center hover:text-primary/80 font-medium hover:underline transition duration-200"
              >
                Vezi toate informațiile despre înregistrare
              </Link>

              <FaCircle className="inline mx-2" size={6} />

              <Link
                href="/reg"
                className="inline-flex items-center hover:text-primary/80 font-medium hover:underline transition duration-200"
              >
                Regulament
              </Link>

              <FaCircle className="inline mx-2" size={6} />
              <Link
                href="/ghid"
                className="inline-flex items-center hover:text-primary/80 font-medium hover:underline transition duration-200"
              >
                Ghid redactare abstracte
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
