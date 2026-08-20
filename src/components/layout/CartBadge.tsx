"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export function CartBadge() {
  const { count, ready } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm hover:bg-surface-2"
    >
      Cart
      {/* Only render the number after hydration so SSR and client markup match. */}
      {ready && count > 0 ? (
        <span
          className="inline-flex min-w-6 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-accent-ink"
          aria-label={`${count} items in cart`}
        >
          {count}
        </span>
      ) : null}
    </Link>
  );
}