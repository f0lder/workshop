export type UserRole = 'admin' | 'user';

// MongoDB User interface
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

// MongoDB Workshop interface
export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  maxParticipants: number;
  current_participants: number;
  max_participants: number; // Alias for compatibility
  instructor: string;
  status: 'active' | 'cancelled' | 'completed';
  registrationStatus: 'open' | 'closed';
  // For display in UI
  user_registered?: boolean;
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
