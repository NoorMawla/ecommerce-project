import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the items in your VOLT cart before checkout.",
};

export default function CartPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Your cart</h1>
      <CartView />
    </div>
  );
}
