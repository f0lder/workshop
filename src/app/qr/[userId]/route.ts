import { NextRequest } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getUser } from '@/app/dashboard/profile/actions';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ userId: string }> }
) {
	const { userId } = await params;
	const currentUserData = await currentUser();

	// If no current user, redirect to profile
	if (!currentUserData) {
		redirect('/dashboard/profile');
	}

	const userData = await getUser(currentUserData.id);
	if (!userData) {
		// If user not found, redirect to profile
		redirect('/dashboard/profile');
	}

	// Check if current user is admin
	const isAdmin = userData.role === 'admin';

	if (isAdmin) {
		// Admin: redirect to attendance confirmation page
		redirect(`/admin/attendance/${userId}`);
	} else {
		// Regular user: redirect to their profile
		redirect('/dashboard/profile');
	}
}