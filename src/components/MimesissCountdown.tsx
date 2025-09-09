'use client'

import { useState, useEffect, useMemo } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function MimesissCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [mounted, setMounted] = useState(false)

  // Calculate initial time on component mount to avoid hydration mismatch
  const initialTime = useMemo(() => {
    const conferenceDate = new Date('2025-11-13T00:00:00')
    const now = new Date()
    const difference = conferenceDate.getTime() - now.getTime()

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }, [])

  useEffect(() => {
    setMounted(true)
    setTimeLeft(initialTime)
    
    const calculateTimeLeft = (): TimeLeft => {
      const conferenceDate = new Date('2025-11-13T00:00:00')
      const now = new Date()
      const difference = conferenceDate.getTime() - now.getTime()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [initialTime])

  if (!mounted) {
    return (
      <div className="mimesiss-countdown-container">
        <div className="mimesiss-countdown-card">
          <div className="text-center mb-6">
            <svg className="h-8 w-8 text-primary mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">Timpul rămas până la MIMESISS 2025</h3>
            <p className="mimesiss-text-secondary">Se încarcă...</p>
          </div>
        </div>
      </div>
    )
  }

  const isConferenceStarted = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0

  return (
    <div className="mimesiss-countdown-container">
      <div className="mimesiss-countdown-card">
        <div className="text-center mb-6">
          <svg className="h-8 w-8 text-primary mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
          <h3 className="text-2xl font-bold text-white mb-2">
            {isConferenceStarted ? 'MIMESISS 2025 a început!' : 'Timpul rămas până la MIMESISS 2025'}
          </h3>
          <p className="mimesiss-text-secondary">
            {isConferenceStarted ? 'Conferința este în desfășurare' : '13-16 Noiembrie 2025'}
          </p>
        </div>

        {!isConferenceStarted && (
          <div className="mimesiss-countdown-grid">
            <div className="mimesiss-countdown-item">
              <div className="mimesiss-countdown-number">{timeLeft.days}</div>
              <div className="mimesiss-countdown-label">
                {timeLeft.days === 1 ? 'Zi' : 'Zile'}
              </div>
            </div>
            
            <div className="mimesiss-countdown-item">
              <div className="mimesiss-countdown-number">{timeLeft.hours}</div>
              <div className="mimesiss-countdown-label">
                {timeLeft.hours === 1 ? 'Oră' : 'Ore'}
              </div>
            </div>
            
            <div className="mimesiss-countdown-item">
              <div className="mimesiss-countdown-number">{timeLeft.minutes}</div>
              <div className="mimesiss-countdown-label">
                {timeLeft.minutes === 1 ? 'Minut' : 'Minute'}
              </div>
            </div>
            
            <div className="mimesiss-countdown-item">
              <div className="mimesiss-countdown-number">{timeLeft.seconds}</div>
              <div className="mimesiss-countdown-label">
                {timeLeft.seconds === 1 ? 'Secundă' : 'Secunde'}
              </div>
            </div>
          </div>
        )}

        {isConferenceStarted && (
          <div className="text-center">
            <div className="bg-primary/20 rounded-lg p-6 border border-primary/30">
              <svg className="h-12 w-12 text-primary mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <p className="text-lg text-white font-medium">
                Bun venit la cea de-a V-a ediție a MIMESISS!
              </p>
              <p className="mimesiss-text-secondary mt-2">
                Conferința este în desfășurare la Spitalul militar central &ldquo;Dr. Carol Davila&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
