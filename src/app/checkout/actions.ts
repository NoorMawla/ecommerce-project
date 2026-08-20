"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { computeTotals } from "@/lib/totals";
import { validateCheckout, type CheckoutInput } from "@/lib/validation/checkout";

type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

/**
 * Creates the order. Everything is verified server-side:
 * - shipping details re-validated
 * - prices and totals read from the database, never from the client
 * - stock checked, then decremented inside one transaction
 *
 * Stripe test-mode payment hooks in right before `prisma.order.create`
 * (noor: create the PaymentIntent and only continue when it succeeds).
 */
export async function placeOrder(input: {
  shipping: CheckoutInput;
  items: { productId: string; quantity: number }[];
}): Promise<PlaceOrderResult> {
  const errors = validateCheckout(input.shipping);
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: "Please correct the shipping details." };
  }

  const cleanItems = input.items.filter(
    (i) => typeof i.productId === "string" && Number.isInteger(i.quantity) && i.quantity > 0,
  );
  if (cleanItems.length === 0) return { ok: false, error: "Your cart is empty." };

  const products = await prisma.product.findMany({
    where: { id: { in: cleanItems.map((i) => i.productId) } },
  });
  if (products.length !== cleanItems.length) {
    return { ok: false, error: "One of the products is no longer available." };
  }

  const lines = cleanItems.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    return { product, quantity: item.quantity };
  });

  const outOfStock = lines.find((l) => l.quantity > l.product.stock);
  if (outOfStock) {
    return {
      ok: false,
      error: `Only ${outOfStock.product.stock} × ${outOfStock.product.name} left in stock.`,
    };
  }

  const subtotal = lines.reduce(
    (sum, l) => sum + l.product.price * l.quantity,
    0,
  );
  const totals = computeTotals(subtotal);

  const session = await auth();

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: session?.user?.id ?? null,
        fullName: input.shipping.fullName.trim(),
        email: input.shipping.email.trim(),
        phone: input.shipping.phone.trim(),
        addressLine1: input.shipping.addressLine1.trim(),
        addressLine2: input.shipping.addressLine2?.trim() || null,
        city: input.shipping.city.trim(),
        state: input.shipping.state.trim(),
        postalCode: input.shipping.postalCode.trim(),
        country: input.shipping.country.trim(),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        status: "PAID", // switch to PENDING until Stripe confirms, once payments land
        items: {
          create: lines.map((l) => ({
            productId: l.product.id,
            quantity: l.quantity,
            unitPriceAtPurchase: l.product.price,
          })),
        },
      },
    });

    for (const line of lines) {
      await tx.product.update({
        where: { id: line.product.id },
        data: { stock: { decrement: line.quantity } },
      });
    }

    return created;
  });

  return { ok: true, orderNumber: order.orderNumber };
}
