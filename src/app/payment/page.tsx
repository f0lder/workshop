import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { syncUserWithDatabase } from '@/lib/auth';
import { User } from '@/types/models';
import EnhancedTicketSelector from '@/components/EnhancedTicketSelector';

export default async function PaymentPage() {
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    redirect('/auth/login');
  }

  // Sync user and get current access level
  const user: User = await syncUserWithDatabase(clerkUser);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <EnhancedTicketSelector currentAccessLevel={user.accessLevel} />
      </div>
    </div>
  );
}