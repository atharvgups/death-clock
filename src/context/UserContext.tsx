import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface UserContextType {
  user: any;
  loading: boolean;
  updateProfile: (updates: { display_name?: string; email?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  const updateProfile = async (updates: { display_name?: string; email?: string }) => {
    if (!user) return;
    // Only email can be updated via supabase.auth.updateUser
    if (updates.email) {
      await supabase.auth.updateUser({ email: updates.email });
    }
    // Display name is stored in user_metadata
    if (updates.display_name) {
      await supabase.auth.updateUser({ data: { display_name: updates.display_name } });
    }
    await refreshUser();
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateProfile, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
} 