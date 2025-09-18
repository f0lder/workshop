'use client'

import { useUser } from '@clerk/nextjs'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Header to reduce initial bundle
const Header = dynamic(() => import('./Header'), {
  ssr: false,
  loading: () => (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-300 rounded animate-pulse hidden sm:block"></div>
          </div>
          <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    </header>
  )
})

export default function HeaderWrapper() {
  const { user, isLoaded } = useUser()
  
  // Show loading header immediately for better UX
  if (!isLoaded) {
    return (
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-300 rounded animate-pulse hidden sm:block"></div>
            </div>
            <div className="h-8 w-24 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }
  
  return (
    <Suspense fallback={
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    }>
      <Header user={user} />
    </Suspense>
  )
}
