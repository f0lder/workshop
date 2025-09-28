import HeaderContent from "@/components/HeaderContent";


export default function GhidPage() {
	return (
		<>
			<HeaderContent title='Ghid de redactare al abstractelor pentru Sesiunea de Comunicări Științifice Medico-Militare, MIMESISS 2025' />
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<h2 className="mimesiss-subtitle">Tehnoredactare</h2>
				<ul className="list-disc list-inside flex flex-col gap-4">
					<li>Titlul lucrării: Times New Roman, 12, Bold, centrat</li>
					<li>Autor și coordonator științific: Times New Roman, 12, aliniere spre dreapta.
						Se vor trece numele și prenumele autorului, respectiv numele și prenumele coordonatorului stiintific.</li>
					<li>Afilieri: Times New Roman, 10, italic, aliniere spre dreapta.
						Se va adauga numărul afilierii cu superscript, iar pe rândul următor vor fi numerotate afilierile instituționale.
						Ex: Popescu Ionel1, Ionescu Tudor2
						1.Institutul Medico-Militar București, 2. Universitatea de Medicină și Farmacie “Carol Davila” București
					</li>
					<li>
						Keywords: Times New Roman, 12, aliniere la dreapta, titlul secțiunii de Keywords va fi scris cu bold.

						Se vor alege cinci cuvinte cheie care să prezinte  esența temei alese.
					</li>

					<li>Body text: Times New Roman, 12, aliniere justified, spațiere între rânduri 1.15.
						Numele secțiunilor va fi scris cu bold.
						Abstractul va cuprinde 5 sectiuni: Introducere, Obiective, Materiale și metode, Rezultate, Concluzii, în care se va urmări prezentarea succintă a datelor lucrării științifice susținute în cadrul congresului.
					</li>
				</ul>

				<div className="flex flex-col gap-4 mt-8">
					<p>Documentul va avea un maxim de 300-350 de cuvinte (se cere încadrarea textului pe o singură pagină).</p>

					<p>Documentul va fi submis în format Word (.doc) sau PDF (.pdf) începând cu data de ... până la data de ... , la adresa de e-mail ...</p>

					<p>Evaluarea abstractelor va avea loc în perioada ...</p>

					<p>Rezultatele evaluării vor fi transmise prin e-mail ...</p>

					<p>Doar versiunea finală submisă înainte de deadline va fi acceptată și nu vor mai putea fi aduse modificări ulterioare documentului.</p>
				</div>
			</div>
		</>
	);
}