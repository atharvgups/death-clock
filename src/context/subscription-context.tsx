import React, { createContext, useContext, useState, useEffect } from "react";
import { Subscription, SubscriptionStats, SubscriptionStatus } from "../types";
import { toast } from "sonner";
import { createRoot } from "react-dom/client";
import { FuneralDialog } from "@/components/subscriptions/funeral-dialog";
import { useUser } from './UserContext';
import { supabase } from '../supabaseClient';

type SubscriptionContextType = {
  subscriptions: Subscription[];
  stats: SubscriptionStats;
  addSubscription: (subscription: Omit<Subscription, "id" | "status">) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscription: (id: string) => Subscription | undefined;
  performFuneral: (id: string) => void;
  setSubscriptions: React.Dispatch<React.SetStateAction<Subscription[]>>;
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

const calculateStatus = (endDate: string, autoRenew: boolean, forceExpired?: boolean): SubscriptionStatus => {
  if (forceExpired) return 'expired';

  const now = new Date();
  const end = new Date(endDate);
  const daysRemaining = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysRemaining < 0) return 'expired';
  if (daysRemaining <= 3) return 'critical';
  if (daysRemaining <= 7) return 'warning';
  return 'active';
};

const calculateStats = (subscriptions: Subscription[]): SubscriptionStats => {
  const active = subscriptions.filter(sub => sub.status !== 'expired');
  const expired = subscriptions.filter(sub => sub.status === 'expired');
  
  let monthlyCost = 0;
  let yearlyCost = 0;
  
  active.forEach(sub => {
    const cost = Number(sub.cost) || 0;
    switch(sub.frequency) {
      case 'monthly':
        monthlyCost += cost;
        yearlyCost += cost * 12;
        break;
      case 'yearly':
        monthlyCost += cost / 12;
        yearlyCost += cost;
        break;
      case 'quarterly':
        monthlyCost += cost / 3;
        yearlyCost += cost * 4;
        break;
      case 'weekly':
        monthlyCost += cost * 4.33;
        yearlyCost += cost * 52;
        break;
    }
  });
  
  const activeAndSorted = [...active].sort((a, b) => 
    new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  );
  
  return {
    totalActive: active.length,
    totalExpired: expired.length,
    monthlyCost: Number(monthlyCost.toFixed(2)),
    yearlyCost: Number(yearlyCost.toFixed(2)),
    nextToExpire: activeAndSorted[0]
  };
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats>({
    totalActive: 0,
    totalExpired: 0,
    monthlyCost: 0,
    yearlyCost: 0
  });

  // Notification settings state
  const [browserNotifications, setBrowserNotifications] = useState(() => localStorage.getItem('deathClock_browserNotifications') === 'true');
  const [reminderDays, setReminderDays] = useState(() => parseInt(localStorage.getItem('deathClock_reminderDays') || '7', 10));

  // Sync notification settings with localStorage
  useEffect(() => {
    const syncSettings = () => {
      setBrowserNotifications(localStorage.getItem('deathClock_browserNotifications') === 'true');
      setReminderDays(parseInt(localStorage.getItem('deathClock_reminderDays') || '7', 10));
    };
    window.addEventListener('focus', syncSettings);
    return () => window.removeEventListener('focus', syncSettings);
  }, []);

  // Fetch subscriptions from Supabase for the logged-in user
  const fetchSubscriptions = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);
    if (data) {
      // Immediately recalculate status for each subscription
      const updated = data.map(sub => ({
        ...sub,
        status: calculateStatus(sub.endDate, sub.autoRenew, sub.forceExpired)
      }));
      setSubscriptions(updated);
      setStats(calculateStats(updated));
    }
  };

  useEffect(() => {
    if (user) fetchSubscriptions();
    else setSubscriptions([]);
  }, [user]);

  useEffect(() => {
    localStorage.setItem('deathClock_subscriptions', JSON.stringify(subscriptions));
    setStats(calculateStats(subscriptions));
  }, [subscriptions]);

  // Browser notification logic
  useEffect(() => {
    if (!browserNotifications || !('Notification' in window) || Notification.permission !== 'granted') return;
    if (!reminderDays) return;

    const notifiedIds = JSON.parse(localStorage.getItem('deathClock_notifiedIds') || '[]');
    const now = Date.now();
    const msInDay = 24 * 60 * 60 * 1000;

    subscriptions.forEach(sub => {
      if (sub.status === 'expired') return;
      const end = new Date(sub.endDate).getTime();
      const daysLeft = Math.ceil((end - now) / msInDay);
      if (daysLeft <= reminderDays && !notifiedIds.includes(sub.id)) {
        // Show notification
        new Notification(`Subscription expiring soon: ${sub.name}`, {
          body: `Your ${sub.name} subscription will expire in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`,
          icon: '/vite.svg',
        });
        notifiedIds.push(sub.id);
      }
    });
    localStorage.setItem('deathClock_notifiedIds', JSON.stringify(notifiedIds));

    // Check every hour
    const interval = setInterval(() => {
      const notifiedIds = JSON.parse(localStorage.getItem('deathClock_notifiedIds') || '[]');
      const now = Date.now();
      subscriptions.forEach(sub => {
        if (sub.status === 'expired') return;
        const end = new Date(sub.endDate).getTime();
        const daysLeft = Math.ceil((end - now) / msInDay);
        if (daysLeft <= reminderDays && !notifiedIds.includes(sub.id)) {
          new Notification(`Subscription expiring soon: ${sub.name}`, {
            body: `Your ${sub.name} subscription will expire in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`,
            icon: '/vite.svg',
          });
          notifiedIds.push(sub.id);
        }
      });
      localStorage.setItem('deathClock_notifiedIds', JSON.stringify(notifiedIds));
    }, 60 * 60 * 1000); // every hour
    return () => clearInterval(interval);
  }, [subscriptions, browserNotifications, reminderDays]);

  // Add subscription to Supabase
  const addSubscription = async (subscription: Omit<Subscription, "id" | "status">) => {
    if (!user) return;
    // Ensure all required fields are present and valid
    const newSubscription: Subscription = {
      ...subscription,
      user_id: user.id,
      id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      status: calculateStatus(subscription.endDate, subscription.autoRenew),
      liked: false,
      deleted: false,
      forceExpired: false,
      funeralType: subscription.funeralType || 'standard',
      category: subscription.category || 'Other',
      notes: subscription.notes || ''
    };
    const { data, error } = await supabase.from('subscriptions').insert([newSubscription]);
    if (error) {
      console.error('Supabase insert error:', error.message, error.details, error.hint, error.code, newSubscription);
    }
    if (!error) fetchSubscriptions();
  };

  // Update subscription in Supabase
  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    if (!user) return;
    const { error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id);
    if (!error) fetchSubscriptions();
  };

  // Delete subscription in Supabase (soft delete)
  const deleteSubscription = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'expired', deleted: true, forceExpired: true })
      .eq('id', id)
      .eq('user_id', user.id);
    if (!error) fetchSubscriptions();
  };

  const getSubscription = (id: string) => {
    return subscriptions.find(sub => sub.id === id);
  };

  const performFuneral = (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    if (subscription) {
      updateSubscription(id, { status: 'expired' });
      
      const dialogElement = document.createElement('div');
      document.body.appendChild(dialogElement);
      
      const root = createRoot(dialogElement);
      root.render(
        <FuneralDialog 
          subscription={subscription} 
          onClose={() => {
            root.unmount();
            document.body.removeChild(dialogElement);
          }} 
        />
      );
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        stats,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        getSubscription,
        performFuneral,
        setSubscriptions: setSubscriptions // for compatibility, but not used for persistence
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
