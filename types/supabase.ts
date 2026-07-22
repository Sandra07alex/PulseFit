// Supabase-specific types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          displayName: string;
          avatar: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      goals: {
        Row: {
          id: string;
          userId: string;
          type: string;
          target: number;
          current: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['goals']['Row']>;
      };
      workouts: {
        Row: {
          id: string;
          userId: string;
          type: string;
          duration: number;
          calories: number;
          notes: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['workouts']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['workouts']['Row']>;
      };
      nutrition: {
        Row: {
          id: string;
          userId: string;
          food: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: Omit<Database['public']['Tables']['nutrition']['Row'], 'id' | 'createdAt' | 'updatedAt'>;
        Update: Partial<Database['public']['Tables']['nutrition']['Row']>;
      };
      hydration: {
        Row: {
          id: string;
          userId: string;
          amount: number;
          createdAt: string;
        };
        Insert: Omit<Database['public']['Tables']['hydration']['Row'], 'id' | 'createdAt'>;
        Update: Partial<Database['public']['Tables']['hydration']['Row']>;
      };
      progress: {
        Row: {
          id: string;
          userId: string;
          weight: number | null;
          measurements: Record<string, number> | null;
          photos: string[] | null;
          notes: string | null;
          createdAt: string;
        };
        Insert: Omit<Database['public']['Tables']['progress']['Row'], 'id' | 'createdAt'>;
        Update: Partial<Database['public']['Tables']['progress']['Row']>;
      };
    };
  };
}
