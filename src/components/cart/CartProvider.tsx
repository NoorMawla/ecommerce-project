"use client";

import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import { computeTotals, type Totals } from "@/lib/totals";
import {
  addItem,
  clearCart,
  getServerSnapshot,
  getSnapshot,
  removeItem,
  setItemQuantity,
  subscribe,
  type CartItem,
} from "@/lib/cart-store";

export type { CartItem };

/** Kept so the root layout has one obvious place to mount cart concerns. */
export function CartProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useCart(): {
  items: CartItem[];
  count: number;
  totals: Totals;
  ready: boolean;
  add: typeof addItem;
  setQuantity: typeof setItemQuantity;
  remove: typeof removeItem;
  clear: typeof clearCart;
} {
  const { items, ready } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return {
      items,
      ready,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      totals: computeTotals(subtotal),
      add: addItem,
      setQuantity: setItemQuantity,
      remove: removeItem,
      clear: clearCart,
    };
  }, [items, ready]);
}
