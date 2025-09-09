import Link from 'next/link'
import { currentUser } from '@clerk/nextjs/server'
import CountdownWrapper from '@/components/CountdownWrapper'

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
              <svg className="h-6 w-6 text-primary mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              <span className="text-xl font-semibold text-white">13-16 NOIEMBRIE 2025</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="mimesiss-text-secondary">Spitalul universitar de urgență militar central &ldquo;Dr. CAROL DAVILA&rdquo;</span>
            </div>
          </div>

          {/* Countdown */}
          <CountdownWrapper />

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
              <svg className="h-8 w-8 text-primary mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <h4 className="text-lg font-semibold text-white mb-2">Email</h4>
              <a href="mailto:office.asmm@gmail.com" className="mimesiss-text-secondary hover:text-primary transition duration-200">
                office.asmm@gmail.com
              </a>
            </div>
            <div className="mimesiss-contact-card">
              <svg className="h-8 w-8 text-primary mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
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
