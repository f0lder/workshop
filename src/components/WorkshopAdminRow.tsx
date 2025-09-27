import Link from 'next/link';
import { Workshop, User } from '@/types/models';
import { FaCalendarAlt, FaEdit, FaUsers, FaMapMarkerAlt, FaUser } from 'react-icons/fa'
import DeleteWorkshopButton from '@/components/DeleteWorkshopButton'
import { getRegistrations } from '@/app/admin/workshops/actions';

export default async function WorkshopAdminRow({ workshop }: { workshop: Workshop }) {

	// Ensure we always have a User[] even if getRegistrations returns void or an unexpected value
	const registrations = await getRegistrations(workshop._id?.toString() || workshop.id || '');

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

				<div className="mt-2 max-h-40 overflow-y-auto pt-2">
					<h4 className="text-sm font-medium text-foreground mb-2">Utilizatori înregistrați</h4>
					{registrations && registrations.length > 0 ? (
						<table className="min-w-full divide-y divide-border">
							<thead>
								<tr>
									<th colSpan={1} className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Utilizator</th>
									<th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Email</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{registrations.map((user: User) => (
									<tr key={user._id} className="hover:bg-muted">
										<td className="px-4 py-2 text-sm text-foreground">{user.firstName} {user.lastName}</td>
										<td className="px-4 py-2 text-sm text-muted-foreground">{user.email}</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className="text-sm text-muted-foreground">Niciun utilizator înregistrat</p>
					)}
				</div>
			</div>

		</li>
	);
}