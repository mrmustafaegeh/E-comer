import Stripe from "stripe";

// Helper to prevent app crash if keys are missing during build/dev
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("STRIPE_SECRET_KEY is missing in production.");
    }
    console.warn("⚠️ STRIPE_SECRET_KEY is missing. Stripe features will fail.");
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
    typescript: false,
  });
};

export const stripe = getStripe();
