import Link from 'next/link';
import { Workshop,User } from '@/types/models';
import WorkshopRegistrationToggle from '@/components/WorkshopRegistrationToggle'
import { FaCalendarAlt, FaEdit, FaUsers, FaMapMarkerAlt, FaUser } from 'react-icons/fa'
import DeleteWorkshopButton from '@/components/DeleteWorkshopButton'
import {getRegistrations } from '@/app/admin/workshops/actions';

export default async function WorkshopAdminRow({ workshop }: { workshop: Workshop }) {

	// Ensure we always have a User[] even if getRegistrations returns void or an unexpected value
	const _regs = await getRegistrations(workshop._id?.toString() || workshop.id || '') as unknown;
	const registrations: User[] = Array.isArray(_regs) ? _regs : [];

	return (
		<li key={workshop._id?.toString() || workshop.id || ''}>
			<div className="px-3 py-4 sm:px-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
					<div className="flex-1 min-w-0">
						<div className="space-y-2">
							<div>
								<p className="text-sm font-medium text-foreground">
									{workshop.title}
								</p>
								<p className="text-sm text-muted-foreground line-clamp-2">
									{workshop.description}
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 sm:ml-4">
						<WorkshopRegistrationToggle
							workshopId={workshop._id?.toString() || workshop.id || ''}
							currentStatus={workshop.registrationStatus || 'open'}
						/>
						<div className="flex space-x-2">
							<Link
								href={`/admin/workshops/edit/${workshop._id?.toString() || workshop.id}`}
								className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-foreground bg-primary hover:bg-primary/90"
							>
								<FaEdit className="mr-1 h-3 w-3" />
								<span className="hidden sm:inline">Editează</span>
								<span className="sm:hidden">Edit</span>
							</Link>
							<DeleteWorkshopButton
								workshopId={workshop._id?.toString() || workshop.id || ''}
								workshopTitle={workshop.title}
							/>

						</div>
					</div>
				</div>
				<div className="mt-3 flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground space-y-2 sm:space-y-0 sm:space-x-4">
					<div className="flex items-center">
						<FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4" />
						<span className="truncate">{new Date(workshop.date).toLocaleDateString('ro-RO')} la {workshop.time}</span>
					</div>
					<div className="flex items-center">
						<FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4" />
						<span className="truncate">{workshop.location}</span>
					</div>
					<div className="flex items-center">
						<FaUsers className="flex-shrink-0 mr-1.5 h-4 w-4" />
						<span>{workshop.currentParticipants || 0}/{workshop.maxParticipants} participanți</span>
					</div>
					{workshop.instructor && (
						<div className="flex items-center">
							<FaUser className="flex-shrink-0 mr-1.5 h-4 w-4" />
							<span className="truncate">{workshop.instructor}</span>
						</div>
					)}
				</div>
			</div>

			<div>
				<div className="mt-2 max-h-40 overflow-y-auto border-t border-border pt-2">
					{registrations && registrations.length > 0 ? (
						<ul className="space-y-1">
							{registrations.map((user: User) => (
								<li key={user._id} className="flex items-center justify-between py-1">
									<span className="text-sm text-muted-foreground">{user.email}</span>
								</li>
							))}
						</ul>
					) : (
						<p className="text-sm text-muted-foreground">Niciun utilizator înregistrat</p>
					)}
				</div>
			</div>
		</li>
	);
}
