import MimesissCountdown from '@/components/ui/MimesissCountdown'
import { FaCalendar, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import HomePageCTAs, { HomePageCTAsSkeleton } from '@/components/HomePageCTAs'
import { Suspense } from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background">
      {/* Banner Section */}
      <div className="w-full">
        {/* Desktop Banner */}

        <picture>
          <source
            media="(min-width: 768px)"
            srcSet="/banners/desktop.jpeg"
          />
          <img
            src="/banners/mobile.jpeg"
            alt="MIMESISS 2025 Banner"
            className="w-full h-auto object-cover"
            fetchPriority="high"
            loading="eager"
            width="828"
            height="1242"
          />
        </picture>
      </div>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        {/* Event Details */}
        <div className="mimesiss-card flex flex-col gap-5 p-4">
          <div className="flex items-center justify-center">
            <FaCalendar className="h-5 w-5 text-primary mr-2" />
            <span className="text-xl font-semibold">Cand? 13-16 NOIEMBRIE 2025</span>
          </div>
          <div className="flex items-center justify-center">
            <FaMapMarkerAlt className="h-5 w-5 text-primary mr-2" />
            <span className="font-semibold">Unde? Spitalul universitar de urgență militar central &ldquo;Dr. CAROL DAVILA&rdquo;</span>
          </div>

          {/* Countdown */}
          <MimesissCountdown />
        </div>

        <Suspense fallback={<HomePageCTAsSkeleton />}>
          <HomePageCTAs />
        </Suspense>

        <div className="bg-gradient-to-r from-secondary/20 to-background/50 backdrop-blur-sm rounded-lg border border-border/30 p-8 mx-auto">
          <h3 className="text-2xl font-bold text-accent text-center mb-6">Cine suntem?</h3>
          <p className="text-gray-300 text-lg leading-relaxed text-center">
            Asociația Studenților în Medicină Militară (ASMM) este o organizație ce are ca scop reprezentarea studenților Institutului Medico-Militar, a intereselor acestora, cât și organizarea de proiecte care reușesc să îmbine armonios  domeniul medical cu cel militar.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-secondary/20 to-background/50 backdrop-blur-sm rounded-lg border border-border/30 p-8 mx-auto">
          <h3 className="text-2xl font-bold text-accent text-center mb-6">Misiunea Noastră</h3>
          <p className="text-gray-300 text-lg leading-relaxed text-center">
            Misiunea Asociației noastre este ca prin intermediul acestui eveniment să reprezentăm și să sprijinim
            studenții la Medicină Militară, oferindu-le o platformă pentru dezvoltare personală și profesională.
            Ne străduim să promovăm o cultură a excelenței academice, a cercetării medicale de înaltă calitate
            și a valorilor etice și morale în practica medicală militară.
          </p>
        </div>

        {/* Contact Information */}

        <div className="mimesiss-contact-card flex flex-col items-center text-center p-6">
          <FaEnvelope className="h-6 w-6 text-primary mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">Email</h4>
          <a href="mailto:secretariat@asmm-bucuresti.com" className="mimesiss-text-secondary hover:text-primary transition duration-200">
            secretariat@asmm-bucuresti.com
          </a>

        </div>
      </main>
    </div>
  )
}
