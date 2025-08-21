'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { 
  FaCalendarAlt, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaHome,
  FaCog,
  FaUserCog
} from 'react-icons/fa'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

interface HeaderProps {
  user?: User | null
  profile?: Profile | null
  variant?: 'home' | 'dashboard'
}

export default function Header({ user, profile, variant = 'home' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const handleSignOut = async () => {
    if (variant === 'dashboard') {
      await supabase.auth.signOut()
      router.push('/')
      router.refresh()
    }
    setIsMobileMenuOpen(false)
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <>
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <FaCalendarAlt className="h-8 w-8 text-primary" />
                <span className="ml-2 text-2xl font-bold text-foreground">Mimesiss</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                // Logged in user navigation
                <>
                  {variant === 'dashboard' ? (
                    // Dashboard navigation
                    <>
                      <Link
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <FaHome className="h-4 w-4 mr-1" />
                        Dashboard
                      </Link>

                      <Link
                        href="/workshops"
                        className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <FaCalendarAlt className="h-4 w-4 mr-1" />
                        Workshops
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center"
                        >
                          <FaUserCog className="h-4 w-4 mr-1" />
                          Admin
                        </Link>
                      )}

                      <Link
                        href="/dashboard/profile"
                        className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center"
                      >
                        <FaCog className="h-4 w-4 mr-1" />
                        Profile
                      </Link>

                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-foreground">
                          {profile?.full_name || user.email}
                        </span>
                        <button
                          onClick={handleSignOut}
                          className="text-muted-foreground hover:text-destructive p-2 rounded-md"
                          title="Sign out"
                        >
                          <FaSignOutAlt className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    // Home page navigation for logged in users
                    <>
                      <Link
                        href="/dashboard"
                        className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/workshops"
                        className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Workshops
                      </Link>
                      
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Admin
                        </Link>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <FaUser className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {profile?.full_name || user.email}
                        </span>
                      </div>
                      
                      <form action="/auth/signout" method="post">
                        <button
                          type="submit"
                          className="text-muted-foreground hover:text-destructive p-2 rounded-md"
                          title="Sign out"
                        >
                          <FaSignOutAlt className="h-4 w-4" />
                        </button>
                      </form>
                    </>
                  )}
                </>
              ) : (
                // Guest user navigation
                <>
                  <Link
                    href="/workshops"
                    className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Browse Workshops
                  </Link>
                  
                  <Link
                    href="/auth/login"
                    className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  
                  <Link
                    href="/auth/signup"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 backdrop-blur-2xl bg-card/80 border-l border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center">
              <FaCalendarAlt className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold text-foreground">Mimesiss</span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-6 border-b border-border/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <FaUser className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {profile?.full_name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {profile?.role || 'user'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-6 space-y-2">
            {user ? (
              // Logged in user navigation
              <>
                <Link
                  href="/dashboard"
                  onClick={toggleMobileMenu}
                  className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent/50 transition-colors"
                >
                  <FaHome className="h-4 w-4 mr-3" />
                  Dashboard
                </Link>
                
                <Link
                  href="/workshops"
                  onClick={toggleMobileMenu}
                  className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent/50 transition-colors"
                >
                  <FaCalendarAlt className="h-4 w-4 mr-3" />
                  Workshops
                </Link>
                
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={toggleMobileMenu}
                    className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent/50 transition-colors"
                  >
                    <FaUserCog className="h-4 w-4 mr-3" />
                    Admin
                  </Link>
                )}
                
                <Link
                  href="/dashboard/profile"
                  onClick={toggleMobileMenu}
                  className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent/50 transition-colors"
                >
                  <FaCog className="h-4 w-4 mr-3" />
                  Profile
                </Link>
              </>
            ) : (
              // Guest user navigation
              <>
                <Link
                  href="/workshops"
                  onClick={toggleMobileMenu}
                  className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent/50 transition-colors"
                >
                  <FaCalendarAlt className="h-4 w-4 mr-3" />
                  Browse Workshops
                </Link>
                
                <Link
                  href="/auth/login"
                  onClick={toggleMobileMenu}
                  className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent/50 transition-colors"
                >
                  Sign In
                </Link>
                
                <Link
                  href="/auth/signup"
                  onClick={toggleMobileMenu}
                  className="flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Sign Out Button */}
          {user && (
            <div className="p-6 border-t border-border/50">
              {variant === 'dashboard' ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <FaSignOutAlt className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              ) : (
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="flex items-center w-full px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    <FaSignOutAlt className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
