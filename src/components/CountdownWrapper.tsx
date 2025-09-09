'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the countdown to reduce initial bundle size
const MimesissCountdown = dynamic(() => import('./MimesissCountdown'), {
  ssr: false,
  loading: () => (
    <div className="mt-12 p-6 text-center">
      <div className="mimesiss-card p-8 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-white mb-6">Numărătoarea Inversă</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="mimesiss-countdown-box">
              <div className="text-3xl md:text-4xl font-bold text-white">--</div>
              <div className="text-sm text-gray-400">Loading...</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default function CountdownWrapper() {
  return (
    <Suspense fallback={
      <div className="mt-12 p-6 text-center">
        <div className="mimesiss-card p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6">Numărătoarea Inversă</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="mimesiss-countdown-box">
                <div className="text-3xl md:text-4xl font-bold text-white">--</div>
                <div className="text-sm text-gray-400">Loading...</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <MimesissCountdown />
    </Suspense>
  )
}
