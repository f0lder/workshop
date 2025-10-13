import { Ticket as TicketType } from "@/types/models";
import { Ticket } from "@/models";
import connectDB from "@/lib/mongodb";

// Get all tickets
export async function getAllTickets(): Promise<TicketType[]> {
	await connectDB();

	const tickets = await Ticket.find() as TicketType[];
	if (!tickets) {
		throw new Error('No tickets found');
	}

  return tickets;
}