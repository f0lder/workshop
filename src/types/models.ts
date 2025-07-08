import { Database } from './database';

export type UserRole = 'admin' | 'user';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type Workshop = Database['public']['Tables']['workshops']['Row'] & {
  instructor?: Profile;
  registrations?: WorkshopRegistration[];
  // For display in UI
  user_registered?: boolean;
};

export type WorkshopRegistration = Database['public']['Tables']['workshop_registrations']['Row'] & {
  workshop?: Workshop;
  user?: Profile;
};

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
