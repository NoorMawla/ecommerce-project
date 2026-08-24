import Stripe from "stripe";

const globalForStripe = globalThis as unknown as { stripe?: Stripe };

export const stripe =
  globalForStripe.stripe ??
  new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2026-07-29.dahlia",
  });

if (process.env.NODE_ENV !== "production") globalForStripe.stripe = stripe;