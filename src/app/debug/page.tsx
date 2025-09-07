import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import connectDB from '@/lib/mongodb'
import { Workshop, User, Registration } from '@/models'
import { syncUserWithDatabase } from '@/lib/auth'
import { getAppSettings } from '@/lib/settings'

async function getSystemStats() {
  await connectDB()
  
  try {
    const [
      totalWorkshops,
      activeWorkshops,
      totalUsers,
      totalRegistrations,
      settings
    ] = await Promise.all([
      Workshop.countDocuments({}),
      Workshop.countDocuments({ status: 'active' }),
      User.countDocuments({}),
      Registration.countDocuments({ status: 'confirmed' }),
      getAppSettings()
    ])

    return {
      totalWorkshops,
      activeWorkshops,
      totalUsers,
      totalRegistrations,
      settings
    }
  } catch (error) {
    console.error('Error getting system stats:', error)
    return null
  }
}

export default async function DebugPage() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/auth/login')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
    redirect('/unauthorized')
  }

  // Get system statistics
  const systemStats = await getSystemStats()

  // Get package.json info safely
  let packageInfo = {
    name: 'mimesiss',
    version: '0.1.0',
    dependencies: {
      next: '15.x',
      react: '18.x'
    }
  }

  try {
    // Try to read package.json from the project root
    const fs = await import('fs')
    const path = await import('path')
    const packagePath = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(packagePath)) {
      const packageContent = fs.readFileSync(packagePath, 'utf8')
      packageInfo = JSON.parse(packageContent)
    }
  } catch {
    console.log('Could not read package.json, using defaults')
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-foreground">🔧 System Debug & Status</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center">
            📊 System Status
          </h2>
          {systemStats ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database Connection:</span>
                <span className="text-green-600 font-medium">✅ Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Workshops:</span>
                <span className="font-medium">{systemStats.totalWorkshops}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Workshops:</span>
                <span className="font-medium">{systemStats.activeWorkshops}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Users:</span>
                <span className="font-medium">{systemStats.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Registrations:</span>
                <span className="font-medium">{systemStats.totalRegistrations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Global Registration:</span>
                <span className={`font-medium ${systemStats.settings.globalRegistrationEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {systemStats.settings.globalRegistrationEnabled ? '✅ Enabled' : '❌ Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Maintenance Mode:</span>
                <span className={`font-medium ${systemStats.settings.maintenanceMode ? 'text-red-600' : 'text-green-600'}`}>
                  {systemStats.settings.maintenanceMode ? '🚧 Active' : '✅ Normal'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-red-600">❌ Unable to fetch system stats</div>
          )}
        </div>

        {/* Application Info */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center">
            🏗️ Application Info
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Name:</span>
              <span className="font-medium">{packageInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium">{packageInfo.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Node.js Version:</span>
              <span className="font-medium">{process.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment:</span>
              <span className={`font-medium ${process.env.NODE_ENV === 'production' ? 'text-green-600' : 'text-yellow-600'}`}>
                {process.env.NODE_ENV?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Next.js:</span>
              <span className="font-medium">{packageInfo.dependencies?.next || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">React:</span>
              <span className="font-medium">{packageInfo.dependencies?.react || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build Time:</span>
              <span className="font-medium">{new Date().toLocaleString('ro-RO')}</span>
            </div>
          </div>
        </div>

        {/* Services Status */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center">
            🔗 Services Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Clerk Auth:</span>
              <span className={`font-medium ${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'text-green-600' : 'text-red-600'}`}>
                {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Configured' : '❌ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MongoDB:</span>
              <span className={`font-medium ${process.env.MONGODB_URI ? 'text-green-600' : 'text-red-600'}`}>
                {process.env.MONGODB_URI ? '✅ Configured' : '❌ Missing'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
