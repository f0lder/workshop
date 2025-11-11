'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaCamera, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import { Html5Qrcode } from 'html5-qrcode'

export default function QRScanner() {
  const router = useRouter()
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('')
  const [isScanning, setIsScanning] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [mounted, setMounted] = useState(false)
  const isStopping = useRef(false)
  const qrCodeRegionId = 'qr-reader'

  // Set mounted on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Initialize scanner
    async function initScanner() {
      try {
        const html5QrCode = new Html5Qrcode(qrCodeRegionId)
        scannerRef.current = html5QrCode

        // Start scanning
        await html5QrCode.start(
          { facingMode: 'environment' }, // Use back camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            // QR code successfully scanned
            console.log('QR Code scanned:', decodedText)
            
            // Prevent multiple stop attempts
            if (isStopping.current) return
            isStopping.current = true
            
            // Extract userId from the QR code URL
            // Expected format: https://domain.com/qr/user_xxx or just user_xxx
            let userId = decodedText
            
            if (decodedText.includes('/qr/')) {
              const parts = decodedText.split('/qr/')
              userId = parts[1] || decodedText
            }
            
            // Stop scanner and redirect
            setIsScanning(false)
            if (scannerRef.current) {
              scannerRef.current.stop()
                .then(() => {
                  scannerRef.current = null
                  // Small delay to ensure camera is released
                  setTimeout(() => {
                    router.push(`/dashboard/moderator/attendance/${userId}`)
                  }, 100)
                })
                .catch((err) => {
                  console.error('Error stopping scanner:', err)
                  scannerRef.current = null
                  setTimeout(() => {
                    router.push(`/dashboard/moderator/attendance/${userId}`)
                  }, 100)
                })
            } else {
              router.push(`/dashboard/moderator/attendance/${userId}`)
            }
          },
          () => {
            // Scanning error (most are just "no QR code found" which is normal)
            // We don't show these to avoid spamming the UI
          }
        )

        setHasPermission(true)
        setIsScanning(true)
      } catch (err) {
        console.error('Scanner initialization error:', err)
        setHasPermission(false)
        setError('Nu s-a putut accesa camera. Vă rugăm să permiteți accesul la cameră.')
      }
    }

    initScanner()

    // Cleanup function
    return () => {
      if (scannerRef.current && !isStopping.current) {
        isStopping.current = true
        scannerRef.current.stop().catch(() => {
          // Ignore errors during cleanup
        }).finally(() => {
          scannerRef.current = null
        })
      }
    }
  }, [router, mounted])

  const handleManualInput = () => {
    const userId = prompt('Introduceți manual ID-ul utilizatorului:')
    if (userId?.trim()) {
      // Prevent multiple stop attempts
      if (isStopping.current) {
        router.push(`/moderator/attendance/${userId.trim()}`)
        return
      }
      
      // Stop scanner before navigating
      if (scannerRef.current && isScanning) {
        isStopping.current = true
        setIsScanning(false)
        scannerRef.current.stop()
          .then(() => {
            scannerRef.current = null
            setTimeout(() => {
              router.push(`/dashboard/moderator/attendance/${userId.trim()}`)
            }, 100)
          })
          .catch(() => {
            scannerRef.current = null
            setTimeout(() => {
              router.push(`/dashboard/moderator/attendance/${userId.trim()}`)
            }, 100)
          })
      } else {
        router.push(`/dashboard/moderator/attendance/${userId.trim()}`)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-card shadow border border-border rounded-lg overflow-hidden">
        {/* QR Scanner Region - Always rendered */}
        <div id={qrCodeRegionId} className="w-full"></div>
        
        {/* Loading state */}
        {hasPermission === null && (
          <div className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Se inițializează camera...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {hasPermission === false && (
          <div className="p-8">
            <div className="text-center space-y-4">
              <div className="text-red-600 dark:text-red-400">
                <FaCamera className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Eroare Acces Cameră</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Active scanning state */}
        {hasPermission === true && (
          <div className="p-4 bg-muted/50">
            <p className="text-center text-sm text-muted-foreground">
              {isScanning ? 'Poziționați codul QR în fața camerei' : 'Se inițializează scanerul...'}
            </p>
          </div>
        )}
      </div>

      {/* Success message - only show when scanning */}
      {hasPermission === true && isScanning && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
            ✅ Scanner Activ
          </h3>
          <p className="text-sm text-green-800 dark:text-green-200">
            Scanerul QR este activ și gata de utilizare. Când detectează un cod QR, veți fi redirecționat automat către pagina de prezență.
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleManualInput}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted"
        >
          Introduceți manual ID-ul
        </button>
        
        <Link
          href="/dashboard/moderator"
          className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-background hover:bg-muted"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Înapoi
        </Link>
      </div>
    </div>
  )
}
