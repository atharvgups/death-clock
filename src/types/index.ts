export type SubscriptionStatus = 'active' | 'warning' | 'critical' | 'expired';

export type FuneralType = 'viking' | 'pixelated' | 'standard' | 'space';

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  website?: string;
  logo?: string;
  cost: number;
  frequency: 'monthly' | 'yearly' | 'quarterly' | 'weekly';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  notes?: string;
  status: SubscriptionStatus;
  funeralType: FuneralType;
  category?: string;
  liked: boolean;
  deleted?: boolean;
  forceExpired?: boolean;
}

export interface SubscriptionStats {
  totalActive: number;
  totalExpired: number;
  monthlyCost: number;
  yearlyCost: number;
  nextToExpire?: Subscription;
}
