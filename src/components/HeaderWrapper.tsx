'use client'

import Header from './Header'
import { useUser } from '@clerk/nextjs'

export default function HeaderWrapper() {
  const { user, isLoaded } = useUser()
  
  // Wait for Clerk to load before rendering
  if (!isLoaded) {
    return null
  }
  
  // Show header on all pages
  return <Header user={user} />
}
