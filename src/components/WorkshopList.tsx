import { getAllWorkshops, getIsRegisteredForWorkshop } from '@/app/workshops/actions';
import { Workshop } from '@/types/models';
import WorkshopListClient from './WorkshopListClient'; // <-- Import the new client component
import { RegistrationProvider } from '@/contexts/RegistrationContext';

interface WorkshopListProps {
  workshopVisibleToPublic: boolean;
  globalRegistrationEnabled: boolean;
  registrationStartTime: string | null;
  registrationDeadline: string | null;
}

type ExtendedWorkshop = {
  isRegistered: boolean;
} & Workshop;

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export default async function WorkshopList({ workshopVisibleToPublic, globalRegistrationEnabled, registrationStartTime, registrationDeadline }: WorkshopListProps) {
  // If workshops are not visible to public, show coming soon message
  if (!workshopVisibleToPublic) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          În curând...
        </p>
      </div>
    );
  }

  const workshops = await getAllWorkshops();

  // Resolve registration status for each workshop in parallel
  const extendedWorkshops: ExtendedWorkshop[] = await Promise.all(
    workshops.map(async (w) => {
      const workshopId = w._id?.toString();
      if (!isString(workshopId)) {
        // Handle the case where workshopId is not a string, for example by skipping the workshop
        return null;
      }
      const isRegistered = await getIsRegisteredForWorkshop(workshopId);
      return { ...w, isRegistered };
    })
  ).then(results => results.filter(Boolean) as ExtendedWorkshop[]);

  if (extendedWorkshops.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Nu sunt workshop-uri disponibile momentan.
        </p>
      </div>
    );
  }

  const plainWorkshops = extendedWorkshops.map(w => ({
    _id: w._id ? w._id.toString() : '',
    title: w.title,
    description: w.description,
    date: w.date ? new Date(w.date).toISOString() : '',
    time: w.time,
    location: w.location,
    maxParticipants: w.maxParticipants,
    currentParticipants: w.currentParticipants,
    instructor: w.instructor,
    status: w.status,
    wsType: w.wsType,
    url: w.url,
    isRegistered: w.isRegistered,
    createdAt: w.createdAt ? new Date(w.createdAt).toISOString() : '',
    updatedAt: w.updatedAt ? new Date(w.updatedAt).toISOString() : '',
  }));

  return (
    <RegistrationProvider
      value={{
        globalRegistrationEnabled,
        registrationStartTime,
        registrationDeadline,
      }}
    >
      <WorkshopListClient initialWorkshops={plainWorkshops} />
    </RegistrationProvider>
  );
}