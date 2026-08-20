import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your shipping details and review your VOLT order.",
};

export default function CheckoutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
