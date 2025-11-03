import { getAllTickets } from "@/app/info/actions";
import { fetchAllUsers } from "@/app/admin/users/actions";
import PaymentForm from "@/components/PaymentForm";

export default async function NewPaymentPage() {
	// select user and a ticket to create a new payment for the user and update the access level accordingly
	const users = await fetchAllUsers();

	// remove users that already have access level not equal to unpaid
	const eligibleUsers = users.filter(user => user.accessLevel === 'unpaid' || !user.accessLevel);
	const tickets = await getAllTickets();

	return (
		<PaymentForm users={eligibleUsers} tickets={tickets} />
	);
}
