// Supabase Provider
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '~/lib';
import { Loading } from '~/components/ui';

interface SupabaseContextValue {
  supabase: typeof supabase;
  session: any;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export interface SupabaseProviderProps {
  children: React.ReactNode;
}

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupSupabase = async () => {
      try {
        // Get initial session
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        setSession(initialSession);
      } catch (error) {
        console.error('Supabase setup error:', error);
      } finally {
        setLoading(false);
      }
    };

    setupSupabase();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <Loading fullScreen message="Initializing..." />;
  }

  return (
    <SupabaseContext.Provider value={{ supabase, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabaseContext must be used within SupabaseProvider');
  }
  return context;
};
