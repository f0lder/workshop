export type UserRole = 'admin' | 'user';

export type UserType = 'student' | 'elev' | 'rezident';

export type AccessLevel = 'unpaid' | 'active' | 'passive';

// Our MongoDB User interface (this is our main user type)
export interface User {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  userType: UserType;
  accessLevel: AccessLevel;
}

// For Clerk user type, we'll use the imported type from @clerk/nextjs/server

export interface Workshop {
  _id?: string | { toString(): string }; // MongoDB ObjectId
  id?: string; // For serialized versions
  title: string;
  description: string;
  date: Date | string; // Support both Date objects and serialized strings
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  instructor: string;
  status: 'active' | 'cancelled' | 'completed';
  wsType: 'workshop' | 'conferinta';
  user_registered?: boolean; // For display in UI
  createdAt?: Date;
  updatedAt?: Date;
}

// MongoDB Registration interface
export interface WorkshopRegistration {
  _id: string;
  userId: string; // Clerk user ID
  workshopId: string; // Workshop ID
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  app_metadata: {
    provider?: string;
    [key: string]: unknown;
  };
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: unknown;
  };
}

export interface Registrations{
  _id: string;
  userId: string;
  workshopId: string;
}

// Payment interface for client-side usage
export interface Payment {
  _id: string;
  clerkId: string;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  amount: number;
  currency: string;
  accessLevel: AccessLevel;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}