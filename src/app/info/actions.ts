
import { Ticket as TicketType } from "@/types/models";
import { Ticket } from "@/models";
import connectDB from "@/lib/mongodb";

export async function getTicketByType(ticketType: string): Promise<TicketType | null> {
	await connectDB();

	const ticket = await Ticket.findOne({ type: ticketType }).lean();
	if (!ticket) {
		return null;
	}

	return JSON.parse(JSON.stringify(ticket)) as TicketType;
}