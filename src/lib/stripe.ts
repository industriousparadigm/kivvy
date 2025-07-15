import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!_stripe) {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set');
      }
      _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-06-30.basil',
        typescript: true,
      });
    }
    return _stripe[prop as keyof Stripe];
  },
});

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// Platform fee percentage (10%)
export const PLATFORM_FEE_PERCENTAGE = 0.1;

export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * PLATFORM_FEE_PERCENTAGE);
}

export function calculateNetAmount(amount: number): number {
  return amount - calculatePlatformFee(amount);
}
