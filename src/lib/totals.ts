export const FREE_SHIPPING_THRESHOLD = 10000; // $100.00
export const SHIPPING_FLAT = 899; // $8.99
export const TAX_RATE = 0.11; // 11%

export type Totals = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
};

export function computeTotals(subtotal: number): Totals {
  const shipping =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = Math.round(subtotal * TAX_RATE);
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}