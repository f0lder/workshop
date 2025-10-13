'use server'

import { Ticket as TicketType } from "@/types/models";
import { Ticket } from "@/models";
import connectDB from "@/lib/mongodb";

// Get all tickets
export async function getAllTickets(): Promise<TicketType[]> {
	await connectDB();

	const tickets = await Ticket.find().lean();
	if (!tickets) {
		throw new Error('No tickets found');
	}

	// Convert to plain objects to ensure serializability
	return JSON.parse(JSON.stringify(tickets)) as TicketType[];
}

export async function createTicket(data: {
	title: string;
	description: string;
	price: number;
	features: string[];
	type: string;
}): Promise<void> {
	await connectDB();

	const ticket = new Ticket(data);
	await ticket.save();
}

export async function updateTicket(ticketId: string, data: {
	title?: string;
	description?: string;
	price?: number;
	features?: string[];
	type?: string;
}): Promise<void> {
	await connectDB();

	const ticket = await Ticket.findById(ticketId);
	if (!ticket) {
		throw new Error('Ticket not found');
	}

	ticket.title = data.title ?? ticket.title;
	ticket.description = data.description ?? ticket.description;
	ticket.price = data.price ?? ticket.price;
	ticket.features = data.features ?? ticket.features;
	ticket.type = data.type ?? ticket.type;
	await ticket.save();

	// Don't return the Mongoose document to avoid serialization errors
}


export async function deleteTicket(ticketId: string): Promise<void> {
	await connectDB();

	const ticket = await Ticket.deleteOne({_id: ticketId});
	if (!ticket) {
		throw new Error('Ticket not found');
	}
}

export async function getTicketById(ticketId: string): Promise<TicketType | null> {
	await connectDB();

	const ticket = await Ticket.findById(ticketId).lean();
	if (!ticket) {
		return null;
	}

	// Convert to plain object to ensure serializability
	return JSON.parse(JSON.stringify(ticket)) as TicketType;
}