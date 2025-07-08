export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      workshops: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string
          location: string
          max_participants: number
          current_participants: number
          instructor_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          time: string
          location: string
          max_participants: number
          current_participants?: number
          instructor_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string
          location?: string
          max_participants?: number
          current_participants?: number
          instructor_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      workshop_registrations: {
        Row: {
          id: string
          workshop_id: string
          user_id: string
          registered_at: string
        }
        Insert: {
          id?: string
          workshop_id: string
          user_id: string
          registered_at?: string
        }
        Update: {
          id?: string
          workshop_id?: string
          user_id?: string
          registered_at?: string
        }
      }
    }
  }
}
