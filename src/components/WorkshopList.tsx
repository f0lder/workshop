import Link from 'next/link'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa'
import { getAllWorkshops } from '@/app/workshops/actions'

interface WorkshopListProps {
  workshopVisibleToPublic: boolean
}

export default async function WorkshopList({ workshopVisibleToPublic }: WorkshopListProps) {
  // If workshops are not visible to public, show coming soon message
  if (!workshopVisibleToPublic) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          În curând...
        </p>
      </div>
    )
  }

  const workshops = await getAllWorkshops()

  if (workshops.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Nu sunt workshop-uri disponibile momentan.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {workshops.map((workshop) => (
        <div key={workshop._id?.toString()} className="mimesiss-section-card">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {workshop.title}
            </h3>
            <div className="space-y-3">
              {workshop.date && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <FaCalendarAlt className="h-4 w-4 mr-2" />
                  {new Date(workshop.date).toLocaleDateString('ro-RO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              )}

              {workshop.time && (
              <div className="flex items-center text-sm text-muted-foreground">
                <FaClock className="h-4 w-4 mr-2" />
                {workshop.time || 'Ora va fi anunțată'}
              </div>
              )}

              {workshop.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                {workshop.location}
              </div>
              )}


              <div className="flex items-center text-sm text-muted-foreground">
                <FaUsers className="h-4 w-4 mr-2" />
                {workshop.currentParticipants === 0 ? `Niciun participant din ${workshop.maxParticipants}` : (
                  <>
                    {(workshop.currentParticipants || 0)} / {workshop.maxParticipants || 0} participanți
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              {workshop.instructor && (
              <p className="text-sm text-muted-foreground mb-3">
                Instructor: <span className="font-medium text-foreground">{workshop.instructor}</span>
              </p>
              )}

              {workshop.currentParticipants !== 0 && (
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
              )}
            </div>

            <div className="mt-6">
              <Link 
                href={`/workshops/${workshop._id?.toString()}`} 
                className="w-full block text-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Vezi detalii
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
