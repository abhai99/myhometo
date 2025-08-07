
export interface TeerResult {
  date: string;
  first_round: string;
  second_round: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  referralCode?: string;
  referee?: string;
  referrals?: number;
  subscription?: Subscription;
  registeredAt?: string;
}

export interface Subscription {
  type: 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface PredictionResult {
  date: string;
  first_round: string;
  second_round: string;
  prediction: string;
  isCorrect: boolean | null;
}

export interface GutiNumber {
  date: string;
  numbers: string[];
}

export interface SubscriptionCardProps {
  type: 'weekly' | 'monthly';
  price: string;
  features: string[];
  onSelect?: () => void;
}
