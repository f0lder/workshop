export type UserRole = 'admin' | 'user';

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
}

// For Clerk user type, we'll use the imported type from @clerk/nextjs/server

// MongoDB Workshop interface (works for both lean queries and regular documents)
export interface Workshop {
  _id?: string | { toString(): string }; // MongoDB ObjectId
  id?: string; // For serialized versions
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  maxParticipants: number;
  current_participants: number;
  instructor: string;
  status: 'active' | 'cancelled' | 'completed';
  registrationStatus?: 'open' | 'closed';
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
