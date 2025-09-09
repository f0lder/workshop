import Link from 'next/link'
import { FaCalendarAlt, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'
import { currentUser } from '@clerk/nextjs/server'
import MimesissCountdown from '@/components/MimesissCountdown'

export default async function HomePage() {
  const user = await currentUser()

  return (
    <div className="mimesiss-hero-bg">
      {/* Hero Section */}
      <main className="mimesiss-container">
        <div className="text-center">
          <h1 className="mimesiss-title">
            MIMESISS
            <span className="mimesiss-text-primary"> 2025</span>
          </h1>
          <h2 className="mimesiss-subtitle">
            Military Medicine Scientific Session for Students
          </h2>
          <p className="mimesiss-description">
            Cea de-a V-a ediție a Sesiunii de Comunicări Științifice Medico-Militare
          </p>
          
          {/* Event Details */}
          <div className="mt-8 mimesiss-card p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <FaCalendarAlt className="h-6 w-6 text-primary mr-3" />
              <span className="text-xl font-semibold text-white">13-16 NOIEMBRIE 2025</span>
            </div>
            <div className="flex items-center justify-center">
              <FaMapMarkerAlt className="h-5 w-5 text-primary mr-2" />
              <span className="mimesiss-text-secondary">Spitalul universitar de urgență militar central &ldquo;Dr. CAROL DAVILA&rdquo;</span>
            </div>
          </div>

          {/* Countdown */}
          <MimesissCountdown />

          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center">
            {user ? (
              // Logged in user CTAs
              <>
                <div className="rounded-md shadow">
                  <Link href="/dashboard" className="mimesiss-btn-primary">
                    Accesează Contul
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link href="/workshops" className="mimesiss-btn-secondary">
                    Vezi Programul
                  </Link>
                </div>
              </>
            ) : (
              // Guest user CTAs
              <>
                <div className="rounded-md shadow">
                  <Link href="/auth/signup" className="mimesiss-btn-primary">
                    Înregistrează-te
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link href="/info" className="mimesiss-btn-secondary">
                    Informații
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 mimesiss-card-dark p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-6">Misiunea Noastră</h3>
          <p className="mimesiss-text-secondary text-lg leading-relaxed text-center">
            Misiunea Asociației noastre este ca prin intermediul acestui eveniment să reprezentăm și să sprijinim 
            studenții la Medicină Militară, oferindu-le o platformă pentru dezvoltare personală și profesională. 
            Ne străduim să promovăm o cultură a excelenței academice, a cercetării medicale de înaltă calitate 
            și a valorilor etice și morale în practica medicală militară.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="mimesiss-contact-card">
              <FaEnvelope className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Email</h4>
              <a href="mailto:office.asmm@gmail.com" className="mimesiss-text-secondary hover:text-primary transition duration-200">
                office.asmm@gmail.com
              </a>
            </div>
            <div className="mimesiss-contact-card">
              <FaPhone className="h-8 w-8 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">Telefon</h4>
              <a href="tel:0749027151" className="mimesiss-text-secondary hover:text-primary transition duration-200">
                0749027151
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
