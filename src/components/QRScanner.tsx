'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import { Html5Qrcode } from 'html5-qrcode'

// Global flag to prevent multiple instances
let globalScanner: Html5Qrcode | null = null
let isInitializing = false

export default function QRScanner() {
  const router = useRouter()
  const hasScanned = useRef(false)

  useEffect(() => {
    // If already initializing or exists, don't do anything
    if (isInitializing || globalScanner) return
    
    isInitializing = true

    async function initCamera() {
      try {
        const scanner = new Html5Qrcode('qr-reader')
        globalScanner = scanner

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (hasScanned.current) return
            hasScanned.current = true

            let userId = decodedText
            if (decodedText.includes('/qr/')) {
              userId = decodedText.split('/qr/')[1] || decodedText
            }

            router.push(`/moderator/attendance/${userId}`)
          },
          () => {}
        )
      } catch (err) {
        console.error('Camera error:', err)
      } finally {
        isInitializing = false
      }
    }

    initCamera()

    return () => {
      if (globalScanner?.isScanning) {
        globalScanner.stop().catch(() => {})
      }
      globalScanner = null
      isInitializing = false
    }
  }, [router])

  const handleManualInput = () => {
    const userId = prompt('Introduceți ID-ul utilizatorului:')
    if (userId?.trim()) {
      router.push(`/dashboard/moderator/attendance/${userId.trim()}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="mimesiss-card overflow-hidden">
        <div id="qr-reader" className="w-full min-h-[300px]"></div>
        <div className="p-4 bg-muted/30 text-center">
          <p className="text-sm text-muted-foreground">Poziționați codul QR în fața camerei</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={handleManualInput} className="flex-1 mimesiss-btn-secondary text-sm">
          Introdu manual
        </button>
        <Link href="/dashboard/moderator" className="mimesiss-btn-secondary text-sm flex items-center gap-2">
          <FaArrowLeft className="h-3 w-3" />
          Înapoi
        </Link>
      </div>
    </div>
  )
}
