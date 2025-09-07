import connectDB from '@/lib/mongodb'
import { AppSettings, IAppSettings } from '@/models'

// Default settings
const DEFAULT_SETTINGS = {
  globalRegistrationEnabled: true,
  requireApprovalForRegistration: false,
  maxWorkshopsPerUser: 10,
  allowCancelRegistration: true,
  sendEmailNotifications: false,
  sendRegistrationConfirmation: true,
  sendCancellationNotification: true,
  maintenanceMode: false,
  registrationMessage: 'Înregistrează-te la workshop-urile care te interesează!',
  footerText: '© 2025 Mimesiss Workshop Platform',
  defaultMaxParticipants: 20,
  defaultWorkshopDuration: 120,
}

/**
 * Get app settings from database or create default if doesn't exist
 */
export async function getAppSettings(): Promise<IAppSettings> {
  await connectDB()
  
  // Look for any settings document (should only be one)
  let settings = await AppSettings.findOne()
  
  if (!settings) {
    // Create default settings if they don't exist
    settings = await AppSettings.create(DEFAULT_SETTINGS)
  }
  
  return settings
}

/**
 * Update app settings
 */
export async function updateAppSettings(updates: Partial<IAppSettings>): Promise<IAppSettings> {
  await connectDB()
  
  // Find existing settings or create new ones
  let settings = await AppSettings.findOne()
  
  if (!settings) {
    // Create new settings with updates
    settings = await AppSettings.create({ ...DEFAULT_SETTINGS, ...updates })
  } else {
    // Update existing settings
    settings = await AppSettings.findByIdAndUpdate(
      settings._id,
      { $set: updates },
      { new: true }
    )
  }
  
  if (!settings) {
    throw new Error('Failed to update settings')
  }
  
  return settings
}

/**
 * Reset settings to defaults
 */
export async function resetAppSettings(): Promise<IAppSettings> {
  await connectDB()
  
  // Find existing settings
  let settings = await AppSettings.findOne()
  
  if (!settings) {
    // Create new settings with defaults
    settings = await AppSettings.create(DEFAULT_SETTINGS)
  } else {
    // Update existing settings with defaults
    settings = await AppSettings.findByIdAndUpdate(
      settings._id,
      { $set: DEFAULT_SETTINGS },
      { new: true }
    )
  }
  
  if (!settings) {
    throw new Error('Failed to reset settings')
  }
  
  return settings
}

/**
 * Check if global registration is enabled
 */
export async function isGlobalRegistrationEnabled(): Promise<boolean> {
  const settings = await getAppSettings()
  return settings.globalRegistrationEnabled
}

/**
 * Check if app is in maintenance mode
 */
export async function isMaintenanceMode(): Promise<boolean> {
  const settings = await getAppSettings()
  return settings.maintenanceMode
}
