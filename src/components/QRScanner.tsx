'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

export default function QRScanner() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const hasScanned = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let animationId: number

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          scanQRCode()
        }
      } catch (err) {
        console.error('Camera error:', err)
        setError('Nu se poate accesa camera. Vă rugăm să acordați permisiuni.')
      }
    }

    function scanQRCode() {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || hasScanned.current) return

      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        
        // Simple QR detection using browser's built-in barcode detector
        if ('BarcodeDetector' in window) {
          const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
          barcodeDetector.detect(imageData)
            .then((barcodes: any[]) => {
              if (barcodes.length > 0 && !hasScanned.current) {
                hasScanned.current = true
                const qrData = barcodes[0].rawValue
                
                let userId = qrData
                if (qrData.includes('/qr/')) {
                  userId = qrData.split('/qr/')[1] || qrData
                }
                
                router.push(`/moderator/attendance/${userId}`)
              }
            })
            .catch(() => {})
        }
      }

      animationId = requestAnimationFrame(scanQRCode)
    }

    startCamera()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
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
        <div className="relative w-full min-h-[300px] bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-primary rounded-lg"></div>
          </div>
        </div>
        <div className="p-4 bg-muted/30 text-center">
          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Poziționați codul QR în fața camerei</p>
          )}
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
