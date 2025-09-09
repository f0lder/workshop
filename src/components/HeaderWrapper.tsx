'use client'

import { useUser } from '@clerk/nextjs'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Header to reduce initial bundle
const Header = dynamic(() => import('./Header'), {
  ssr: false,
  loading: () => (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
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
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="h-8 w-32 bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
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
