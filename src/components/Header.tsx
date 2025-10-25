'use client'

import { useClerk } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  FaBars,
  FaCalendarAlt,
  FaChartBar,
  FaHome,
  FaImage,
  FaInfoCircle,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaUserPlus,
  FaUsers
} from 'react-icons/fa'

import { useUser } from '@clerk/nextjs'
import Loading from '@/components/Loading'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useClerk()
  const { user,isLoaded } = useUser()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  const links = [
    { href: '/', label: 'Acasă', icon: FaHome },
    { href: '/info', label: 'Informații', icon: FaInfoCircle },
    { href: '/about', label: 'Cine suntem', icon: FaUsers },
    { href: '/workshops', label: 'Ateliere', icon: FaCalendarAlt },
    { href: '/editii', label: 'Ediții anterioare', icon: FaChartBar },
    { href: '/contact', label: 'Date de contact', icon: FaUser },
    { href: '/gallery', label: 'Galerie foto', icon: FaImage },
  ]

  if (!isLoaded) {
    return <Loading />; // or a loading spinner
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/icons/logo_simple.png"
                alt="MIMESISS 2025"
                width={500}
                height={200}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {links.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className={`transition-colors relative underline-offset-4 ${isActive(href) ? 'text-primary underline' : 'text-foreground hover:text-primary hover:underline'}`}>
                  <Icon className="mr-2 hidden lg:inline-block" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 text-foreground hover:text-foreground/80 transition-colors"
                  >
                    <FaUser className="h-4 w-4" />
                    <span>Contul meu</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <FaSignOutAlt className="h-4 w-4" />
                    <span>Deconectare</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="text-foreground hover:text-foreground/80 transition-colors"
                  >
                    Conectare
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                  >
                    Înregistrare
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 text-foreground hover:bg-accent rounded-md transition-colors"
              onClick={toggleMobileMenu}
            >
              <FaBars className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Side Menu Overlay */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
        {/* Backdrop */}
        <button
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={toggleMobileMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMobileMenu();
            }
          }}
          type='button'
          tabIndex={0}
        ></button>

        {/* Side Menu */}
        <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <Link href="/" className="text-xl font-bold text-foreground">
                MIMESISS
              </Link>
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 text-foreground hover:bg-accent rounded-md transition-colors duration-200"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile Section */}
            {user && (
              <div className={`p-6 border-b border-border transform transition-all duration-300 ease-in-out delay-100 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FaUser className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.emailAddresses?.[0]?.emailAddress}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.publicMetadata?.role === 'admin' ? 'Administrator' : 'Utilizator'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 px-6 py-6 space-y-2">
              {links.map(({ href, label, icon: Icon }, index) => (
                <Link
                  key={href}
                  href={href}
                  onClick={toggleMobileMenu}
                  className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 transform ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                    } ${isActive(href) ? 'bg-primary/20 text-primary' : 'text-foreground hover:bg-primary/20 hover:text-primary'}`}
                  style={{ transitionDelay: isMobileMenuOpen ? `${(index + 2) * 100}ms` : '0ms' }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {label}
                </Link>
              ))}

              {user ? (
                // Logged in user actions
                <div className={`border-t border-border/50 my-4 pt-4 transform transition-all duration-200 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? '600ms' : '0ms' }}
                >
                  <Link
                    href="/dashboard"
                    onClick={toggleMobileMenu}
                    className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent/50 transition-colors duration-200"
                  >
                    <FaUser className="h-4 w-4 mr-3" />
                    Contul meu
                  </Link>
                </div>
              ) : (
                // Guest user actions
                <div className={`border-t border-border/50 my-4 pt-4 space-y-2 transform transition-all duration-200 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: isMobileMenuOpen ? '600ms' : '0ms' }}
                >
                  <Link
                    href="/auth/login"
                    onClick={toggleMobileMenu}
                    className="flex items-center px-3 py-2 rounded-md text-foreground hover:bg-accent/50 transition-colors duration-200"
                  >
                    <FaUser className="h-4 w-4 mr-3" />
                    Conectare
                  </Link>

                  <Link
                    href="/auth/signup"
                    onClick={toggleMobileMenu}
                    className="flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                  >
                    <FaUserPlus className="h-4 w-4 mr-3" />
                    Înregistrare
                  </Link>
                </div>
              )}
            </nav>

            {/* Sign Out Button */}
            {user && (
              <div className={`p-6 border-t border-border/50 transform transition-all duration-200 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? '650ms' : '0ms' }}
              >
                <button
                type='button'
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors duration-200"
                >
                  <FaSignOutAlt className="h-4 w-4 mr-3" />
                  Deconectare
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
