export interface PricingPlan {
  name: string;
  price: string;
  amount: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}