import mongoose, { Schema } from 'mongoose'
import type { Document } from 'mongoose'
import type { UserRole, UserType } from '@/types/models'

// User interface
export interface IUser extends Document {
  clerkId: string
  email: string
  firstName?: string
  lastName?: string
  role: UserRole
  userType: UserType
  accessLevel: string
}

// Workshop interface
export interface IWorkshop extends Document {
  title: string
  description: string
  date: Date
  time: string
  location: string
  maxParticipants: number
  currentParticipants: number
  wsType: 'workshop' | 'conferinta'
  instructor: string
  status: 'active' | 'cancelled' | 'completed'
  url?: string;
}

// Registration interface
export interface IRegistration extends Document {
  userId: string // Clerk user ID
  workshopId: string // Workshop ID
  attendance: {
    confirmed: boolean
    confirmedAt?: Date
    confirmedBy?: string // Admin user ID who confirmed
  }
}

export interface ITicket extends Document {
  title: string // Ticket title
  type: string
  price: number // Ticket price in RON
  features: string[] // List of features
  description?: string // Optional detailed description
  enabled: boolean // Whether the ticket is available for purchase
}

// User schema
const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true }, // unique: true creates an index
  email: { type: String, required: true, unique: true }, // unique: true creates an index
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  userType: { type: String, enum: ['student', 'elev', 'rezident'], default: 'student' },
  accessLevel: { type: String, default: 'unpaid' },
}, {
  timestamps: true
})

// Add indexes for performance (clerkId and email already indexed via unique: true)
UserSchema.index({ role: 1 })
UserSchema.index({ accessLevel: 1 })

// Workshop schema
const WorkshopSchema = new Schema<IWorkshop>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: false },
  time: { type: String, required: false },
  location: { type: String, required: false },
  maxParticipants: { type: Number, required: true, min: 1 },
  currentParticipants: { type: Number, default: 0, min: 0 },
  instructor: { type: String, required: false },
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
  wsType: { type: String, enum: ['workshop', 'conferinta'], default: 'workshop' },
  url: { type: String, required: false },
}, {
  timestamps: true
})

// Add indexes for common queries
WorkshopSchema.index({ status: 1, date: 1 })
WorkshopSchema.index({ wsType: 1 })
WorkshopSchema.index({ date: 1 })
WorkshopSchema.index({ status: 1 })

// Registration schema
const RegistrationSchema = new Schema<IRegistration>({
  userId: { type: String, required: true },
  workshopId: { type: String, required: true },
  attendance: {
    confirmed: { type: Boolean, default: false },
    confirmedAt: { type: Date },
    confirmedBy: { type: String }, // Admin user ID who confirmed
  }
}, {
  timestamps: true
})

// Create compound index to prevent duplicate registrations
RegistrationSchema.index({ userId: 1, workshopId: 1 }, { unique: true })
// Add individual indexes for common queries
RegistrationSchema.index({ userId: 1 })
RegistrationSchema.index({ workshopId: 1 })
// Index for attendance queries
RegistrationSchema.index({ 'attendance.confirmed': 1 })

// Payment interface
export interface IPayment extends Document {
  clerkId: string
  stripeSessionId: string
  stripePaymentIntentId?: string
  amount: number
  currency: string
  accessLevel: string // Kept for backward compatibility
  ticketId?: string
  ticketType?: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  metadata?: Record<string, string>
}

// Payment schema
const PaymentSchema = new Schema<IPayment>({
  clerkId: { type: String, required: true, index: true },
  stripeSessionId: { type: String, required: true, unique: true },
  stripePaymentIntentId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'ron' },
  accessLevel: {
    type: String,
    required: true, // Kept for backward compatibility
  },
  ticketId: { type: String, index: true },
  ticketType: { type: String, index: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true
})

// Add compound index for common queries
PaymentSchema.index({ clerkId: 1, status: 1 })
PaymentSchema.index({ clerkId: 1, ticketType: 1 })

const TicketSchema = new Schema<ITicket>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  features: { type: [String], required: true },
  type: { type: String, required: true },
  enabled: { type: Boolean, required: true, default: true },
}, {
  timestamps: true
})

// Models
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export const Workshop = mongoose.models.Workshop || mongoose.model<IWorkshop>('Workshop', WorkshopSchema)
export const Registration = mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema)
export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema)
export const Ticket = mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema)

// Import and export AppSettings separately
import AppSettings from './AppSettings'
export { AppSettings }
export type { IAppSettings } from './AppSettings'
