import { getAllWorkshops } from '@/app/workshops/actions';
import { getIsRegisteredForWorkshop } from '@/app/workshops/actions';
import { Workshop } from '@/types/models';
import WorkshopListClient from './WorkshopListClient'; // <-- Import the new client component

interface WorkshopListProps {
  workshopVisibleToPublic: boolean;
  globalRegistrationEnabled: boolean;
}

type ExtendedWorkshop = {
  isRegistered: boolean;
} & Workshop;

export default async function WorkshopList({ workshopVisibleToPublic, globalRegistrationEnabled }: WorkshopListProps) {
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

  const workshops = await getAllWorkshops() as Workshop[];

  // Resolve registration status for each workshop in parallel
  const extendedWorkshops: ExtendedWorkshop[] = await Promise.all(
    workshops.map(async (w) => {
      const isRegistered = await getIsRegisteredForWorkshop(w._id?.toString() ?? '');
      return Object.assign({}, w, { isRegistered }) as ExtendedWorkshop;
    })
  );

  if (extendedWorkshops.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          Nu sunt workshop-uri disponibile momentan.
        </p>
      </div>
    );
  }

  const serializedWorkshops = JSON.parse(JSON.stringify(extendedWorkshops));

  return (
    <WorkshopListClient
      initialWorkshops={serializedWorkshops}
      globalRegistrationEnabled={globalRegistrationEnabled}
    />
  );
}