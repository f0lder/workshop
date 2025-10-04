import { getWorkshopById } from "../actions";
import HeaderContent from "@/components/HeaderContent";
import type { Workshop } from "@/types/models";

function formatDate(value?: Date | string) {
	if (!value) return "—";
	const d = value instanceof Date ? value : new Date(value);
	return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(d);
}

function formatDateTime(value?: Date | string) {
	if (!value) return "—";
	const d = value instanceof Date ? value : new Date(value);
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(d);
}

export default async function WorkshopPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	const workshop = (await getWorkshopById(id)) as Workshop | null;

	if (!workshop) {
		return <h1>Workshop not found</h1>;
	}

	const workshopDate = workshop.date ? new Date(workshop.date) : undefined;
	return (
		<>
			<HeaderContent title={`Atelier: ${workshop.title}`} />
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
				{/* Basic Info */}
				<div className="mimesiss-card p-6">
					<h2 className="text-2xl font-bold text-accent mb-2">{workshop.title}</h2>
					<p className="text-sm text-muted-foreground mb-4">{workshop.description}</p>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<h4 className="text-xs text-muted-foreground uppercase mb-1">Date</h4>
							<div className="font-medium">{formatDate(workshopDate)}</div>
						</div>

						<div>
							<h4 className="text-xs text-muted-foreground uppercase mb-1">Time</h4>
							<div className="font-medium">{workshop.time ?? "—"}</div>
						</div>

						<div>
							<h4 className="text-xs text-muted-foreground uppercase mb-1">Location</h4>
							<div className="font-medium">{workshop.location ?? "—"}</div>
						</div>

						<div>
							<h4 className="text-xs text-muted-foreground uppercase mb-1">Instructor</h4>
							<div className="font-medium">{workshop.instructor ?? "—"}</div>
						</div>
					</div>
				</div>

				{/* Participation & Status */}
				<div className="mimesiss-card p-6">
					<h3 className="text-xl font-bold text-accent mb-4">Participare</h3>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div>
							<h4 className="text-xs text-muted-foreground uppercase mb-1">Max participanți</h4>
							<div className="font-medium">{workshop.maxParticipants ?? "—"}</div>
						</div>
						<div>
							<h4 className="text-xs text-muted-foreground uppercase mb-1">Participanți curenți</h4>
							<div className="font-medium">{workshop.currentParticipants ?? 0}</div>
						</div>
					</div>

					<div className="mt-4">
						<h4 className="text-xs text-muted-foreground uppercase mb-1">Status atelier</h4>
						<div className="font-medium">{workshop.status ?? "—"}</div>
					</div>
				</div>

				{/* Metadata */}
				<div className="mimesiss-card p-6">
					<h3 className="text-xl font-bold text-accent mb-4">Meta</h3>
					<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<dt className="text-xs text-muted-foreground uppercase">Created at</dt>
							<dd className="font-medium">{formatDateTime(workshop.createdAt)}</dd>
						</div>

						<div>
							<dt className="text-xs text-muted-foreground uppercase">Updated at</dt>
							<dd className="font-medium">{formatDateTime(workshop.updatedAt)}</dd>
						</div>

						<div>
							<dt className="text-xs text-muted-foreground uppercase">Raw _id</dt>
							<dd className="font-medium">
								{workshop._id ? (typeof workshop._id === "string" ? workshop._id : workshop._id.toString()) : "—"}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</>
	);
}
