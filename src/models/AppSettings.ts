import mongoose, { Schema, Document } from 'mongoose'

export interface IAppSettings extends Document {
  _id: string
  // Global workshop settings
  globalRegistrationEnabled: boolean
  requireApprovalForRegistration: boolean
  maxWorkshopsPerUser: number
  allowCancelRegistration: boolean
  
  // Email settings
  sendEmailNotifications: boolean
  sendRegistrationConfirmation: boolean
  sendCancellationNotification: boolean
  
  // General app settings
  maintenanceMode: boolean
  registrationMessage: string
  footerText: string
  
  // Workshop defaults
  defaultMaxParticipants: number
  defaultWorkshopDuration: number // in minutes
  
  createdAt: Date
  updatedAt: Date
}

const AppSettingsSchema = new Schema<IAppSettings>({
  // Global workshop settings
  globalRegistrationEnabled: {
    type: Boolean,
    default: true,
    required: true
  },
  requireApprovalForRegistration: {
    type: Boolean,
    default: false,
    required: true
  },
  maxWorkshopsPerUser: {
    type: Number,
    default: 10,
    min: 1,
    max: 100,
    required: true
  },
  allowCancelRegistration: {
    type: Boolean,
    default: true,
    required: true
  },
  
  // Email settings
  sendEmailNotifications: {
    type: Boolean,
    default: false,
    required: true
  },
  sendRegistrationConfirmation: {
    type: Boolean,
    default: true,
    required: true
  },
  sendCancellationNotification: {
    type: Boolean,
    default: true,
    required: true
  },
  
  // General app settings
  maintenanceMode: {
    type: Boolean,
    default: false,
    required: true
  },
  registrationMessage: {
    type: String,
    default: 'Înregistrează-te la workshop-urile care te interesează!',
    maxlength: 500
  },
  footerText: {
    type: String,
    default: '© 2025 Mimesiss Workshop Platform',
    maxlength: 200
  },
  
  // Workshop defaults
  defaultMaxParticipants: {
    type: Number,
    default: 20,
    min: 1,
    max: 1000,
    required: true
  },
  defaultWorkshopDuration: {
    type: Number,
    default: 120, // 2 hours
    min: 30,
    max: 480, // 8 hours
    required: true
  }
}, {
  timestamps: true
})

// Ensure only one settings document exists by adding a virtual constraint
// We'll handle this in the application logic instead of database constraints

const AppSettings = mongoose.models.AppSettings || mongoose.model<IAppSettings>('AppSettings', AppSettingsSchema)

export default AppSettings
