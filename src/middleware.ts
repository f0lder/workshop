import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/(.*)',
  '/api/payments/webhook(.*)', // Exclude webhook from auth
  '/api/payments/webhook-test(.*)', // Exclude test webhook from auth
])

export default clerkMiddleware(async (auth, req) => {
  // Skip auth for public routes (including webhooks)
  if (isPublicRoute(req)) {
    return
  }
  
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
