import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from './UserContext';

interface Settings {
  id?: string;
  user_id?: string;
  email_reminders?: boolean;
  browser_notifications?: boolean;
  email?: string;
  reminder_days?: number;
  funeral_type?: string;
  pro?: boolean;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    if (!user) return;
    console.log('Fetching settings for user:', user.id);
    setLoading(true);
    let { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id);
    console.log('Fetched data:', data);
    console.log('Fetch error:', error);
    if (error) {
      console.error('Error fetching settings:', error.message, error);
    }
    if ((!data || data.length === 0) && !error) {
      // No row exists, create one with defaults
      const { data: newData, error: insertError } = await supabase.from('settings').insert([
        {
          user_id: user.id,
          email_reminders: false,
          browser_notifications: false,
          email: user.email,
          reminder_days: 7
        }
      ]).select().single();
      if (insertError) {
        console.error('Error inserting default settings:', insertError.message, insertError);
      }
      console.log('Inserted default settings:', newData);
      data = newData ? [newData] : [];
    }
    if (data && data.length > 0) {
      setSettings(data[0]);
      if (window.location.pathname === '/auth/v1/callback') {
        window.location.replace('/');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchSettings();
    else setSettings(null);
  }, [user]);

  const updateSettings = async (updates: Partial<Settings>) => {
    if (!user) return;
    console.log('Updating settings with:', updates);
    console.log('Current settings:', settings);
    let newSettings = { ...settings, ...updates, user_id: user.id };
    if (settings && settings.id) {
      // Update existing
      const { error } = await supabase.from('settings').update(updates).eq('id', settings.id);
      if (error) {
        console.error('Error updating settings:', error.message, error);
        console.log('Update error:', error);
      }
    } else {
      // Insert new
      const { data, error } = await supabase.from('settings').insert([newSettings]).select().single();
      if (error) {
        console.error('Error inserting new settings:', error.message, error);
      }
      if (data) {
        newSettings = data;
        console.log('Inserted new settings:', data);
      }
    }
    setSettings(newSettings);
  };

  const refreshSettings = fetchSettings;

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
} 