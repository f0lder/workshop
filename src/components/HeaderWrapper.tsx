'use client'

import Header from './Header'
import { User } from '@supabase/supabase-js'

// Use the same Profile interface as the Header component
interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

interface HeaderWrapperProps {
  user?: User | null
  profile?: Profile | null
}

export default function HeaderWrapper({ user, profile }: HeaderWrapperProps) {
  // Show header on all pages now (removed auth page exclusion)
  return <Header user={user} profile={profile} />
}
