"use client";

import { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe-client";
import { Button } from "@/components/ui/Button";
import { createPaymentIntent, placeOrder } from "@/app/checkout/actions";
import type { CheckoutInput } from "@/lib/validation/checkout";

type CartLine = { productId: string; quantity: number };

export function PaymentStep({
  shipping,
  cartLines,
  onPlaced,
}: {
  shipping: CheckoutInput;
  cartLines: CartLine[];
  onPlaced: (orderNumber: string) => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    createPaymentIntent(cartLines).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setSetupError(result.error);
        return;
      }
      setClientSecret(result.clientSecret);
      setPaymentIntentId(result.paymentIntentId);
    });

    return () => {
      cancelled = true;
    };
    // cartLines is derived fresh from the cart each render; comparing by
    // productId/quantity content (not identity) is not worth the extra
    // complexity here since this step only mounts once per checkout attempt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (setupError) {
    return (
      <p role="alert" className="text-sm text-danger">
        {setupError}
      </p>
    );
  }

  if (!clientSecret || !paymentIntentId) {
    return (
      <p className="text-sm text-ink-faint">Preparing secure payment…</p>
    );
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <PaymentFields
        shipping={shipping}
        cartLines={cartLines}
        paymentIntentId={paymentIntentId}
        onPlaced={onPlaced}
      />
    </Elements>
  );
}

function PaymentFields({
  shipping,
  cartLines,
  paymentIntentId,
  onPlaced,
}: {
  shipping: CheckoutInput;
  cartLines: CartLine[];
  paymentIntentId: string;
  onPlaced: (orderNumber: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status !== "succeeded") {
      setError("Payment was not completed. Please try again.");
      setSubmitting(false);
      return;
    }

    const result = await placeOrder({
      shipping,
      items: cartLines,
      paymentIntentId,
    });

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    onPlaced(result.orderNumber);
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-5">
      <h2 className="text-base font-semibold">Payment</h2>
      <PaymentElement />

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={!stripe || submitting}>
        {submitting ? "Placing order…" : "Confirm and pay"}
      </Button>
      <p className="text-xs text-ink-faint">
        Totals are recalculated on the server from database prices, and the
        payment is verified with Stripe before the order is created.
      </p>
    </form>
  );
}