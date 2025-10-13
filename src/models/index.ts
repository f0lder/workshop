import mongoose, { Schema, Document } from 'mongoose'
import { UserRole, UserType } from '@/types/models'

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
}

// User schema
const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  userType: { type: String, enum: ['student', 'elev', 'rezident'], default: 'student' },
  accessLevel: { type: String, default: 'unpaid' },
}, {
  timestamps: true
})
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
}, {
  timestamps: true
})

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

const TicketSchema = new Schema<ITicket>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  features: { type: [String], required: true },
  type: { type: String, required: true },
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
