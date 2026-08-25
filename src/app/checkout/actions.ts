"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { computeTotals } from "@/lib/totals";
import { validateCheckout, type CheckoutInput } from "@/lib/validation/checkout";
import type { Product } from "@/generated/prisma/client";

type CartLine = { productId: string; quantity: number };

type ResolvedLines =
  | { ok: true; lines: { product: Product; quantity: number }[]; totals: ReturnType<typeof computeTotals> }
  | { ok: false; error: string };

/**
 * Re-reads every product from the database (never trusts prices/quantities
 * sent from the client), checks stock, and computes totals from those
 * database prices. Shared by `createPaymentIntent` and `placeOrder` so the
 * amount charged and the amount stored on the order can never drift apart.
 */
async function resolveLines(items: CartLine[]): Promise<ResolvedLines> {
  const cleanItems = items.filter(
    (i) => typeof i.productId === "string" && Number.isInteger(i.quantity) && i.quantity > 0,
  );
  if (cleanItems.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

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

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
  return { ok: true, lines, totals: computeTotals(subtotal) };
}

type CreatePaymentIntentResult =
  | { ok: true; clientSecret: string; paymentIntentId: string }
  | { ok: false; error: string };

/**
 * Creates a Stripe PaymentIntent for the cart's server-computed total.
 * Called right before the card form renders in the review step. The amount
 * always comes from `resolveLines`, never from anything the client sends.
 */
export async function createPaymentIntent(
  items: CartLine[],
): Promise<CreatePaymentIntentResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Please log in to check out." };
  }

  const resolved = await resolveLines(items);
  if (!resolved.ok) return resolved;

  if (resolved.totals.total <= 0) {
    return { ok: false, error: "Order total must be greater than zero." };
  }

  const intent = await stripe.paymentIntents.create({
    amount: resolved.totals.total, // already in cents
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  if (!intent.client_secret) {
    return { ok: false, error: "Could not start payment. Please try again." };
  }

  return { ok: true, clientSecret: intent.client_secret, paymentIntentId: intent.id };
}

type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string };

/**
 * Creates the order. Everything is verified server-side:
 * - caller must be logged in (no guest checkout)
 * - shipping details re-validated
 * - prices and totals re-read from the database, never trusted from the client
 * - the Stripe PaymentIntent is retrieved and must show status "succeeded",
 *   for the exact amount computed here, before any order is created
 * - stock checked, then decremented inside one transaction
 *
 * A failed or mismatched payment returns an error and no order is created.
 */
export async function placeOrder(input: {
  shipping: CheckoutInput;
  items: CartLine[];
  paymentIntentId: string;
}): Promise<PlaceOrderResult> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Please log in to check out." };
  }

  const errors = validateCheckout(input.shipping);
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: "Please correct the shipping details." };
  }

  if (!input.paymentIntentId) {
    return { ok: false, error: "Missing payment confirmation." };
  }

  const resolved = await resolveLines(input.items);
  if (!resolved.ok) return resolved;
  const { lines, totals } = resolved;

  const intent = await stripe.paymentIntents.retrieve(input.paymentIntentId);

  if (intent.status !== "succeeded") {
    return { ok: false, error: "Payment was not completed. Please try again." };
  }
  if (intent.amount !== totals.total || intent.currency !== "usd") {
    // The cart changed between payment and confirmation (or something's off).
    // Refuse to create the order rather than trust a stale/mismatched charge.
    return { ok: false, error: "Order total changed. Please review and try again." };
  }

  // Guard against the same PaymentIntent being used to create two orders
  // (e.g. a double form submission).
  const alreadyUsed = await prisma.order.findFirst({
    where: { stripePaymentIntentId: input.paymentIntentId },
  });
  if (alreadyUsed) {
    return { ok: true, orderNumber: alreadyUsed.orderNumber };
  }

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId: session.user.id,
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
        status: "PAID",
        stripePaymentIntentId: input.paymentIntentId,
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