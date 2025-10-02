import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { syncUserWithDatabase } from '@/lib/auth';
import { User } from '@/types/models';
import EnhancedTicketSelector from '@/components/EnhancedTicketSelector';
import { getAppSettings } from '@/lib/settings';

export default async function PaymentPage() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect('/auth/login');
  }

  // Sync user and get current access level
  const user: User = await syncUserWithDatabase(clerkUser);

  // Get global registration setting
  const appSettings = await getAppSettings();
  const globalRegistrationEnabled = appSettings?.globalRegistrationEnabled ?? true;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
	<div className="max-w-4xl mx-auto">
	  {!globalRegistrationEnabled ? (
		<div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
		<strong>Notă:</strong> Înregistrările sunt momentan închise. Te rugăm să verifici înapoi mai târziu.
		</div>
	  ) : (
		<EnhancedTicketSelector currentAccessLevel={user.accessLevel} />
	  )}
	</div>
    </div>
  );
}