import HeaderContent from "@/components/HeaderContent";


export default function ContactPage() {
	return (
		<>
			<HeaderContent title='Contact' />
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Contact Information */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
					<div className="mimesiss-contact-card">
						<svg className="h-8 w-8 text-primary mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
						</svg>
						<h4 className="text-lg font-semibold text-white mb-2">Email</h4>
						<a href="mailto:office.asmm@gmail.com" className="mimesiss-text-secondary hover:text-primary transition duration-200">
							office.asmm@gmail.com
						</a>
					</div>
					<div className="mimesiss-contact-card">
						<svg className="h-8 w-8 text-primary mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
						</svg>
						<h4 className="text-lg font-semibold text-white mb-2">Telefon</h4>
						<a href="tel:0749027151" className="mimesiss-text-secondary hover:text-primary transition duration-200">
							0749027151
						</a>
					</div>

				</div>
			</div>
		</>
	);
}