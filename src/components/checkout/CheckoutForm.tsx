"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/format";
import {
  validateCheckout,
  type CheckoutErrors,
  type CheckoutInput,
} from "@/lib/validation/checkout";
import { placeOrder } from "@/app/checkout/actions";

const EMPTY: CheckoutInput = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Lebanon",
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, totals, clear, ready } = useCart();
  const [step, setStep] = useState<"details" | "review">("details");
  const [values, setValues] = useState<CheckoutInput>(EMPTY);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (ready && items.length === 0) {
    return (
      <EmptyState
        title="Nothing to check out"
        description="Your cart is empty, so there is no order to place yet."
        action={<ButtonLink href="/products">Browse products</ButtonLink>}
      />
    );
  }

  function update(field: keyof CheckoutInput, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function submitDetails(event: React.FormEvent) {
    event.preventDefault();
    const found = validateCheckout(values);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep("review");
  }

  function confirm() {
    setServerError(null);
    startTransition(async () => {
      const result = await placeOrder({
        shipping: values,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      if (!result.ok) {
        setServerError(result.error);
        return;
      }
      clear();
      router.push(`/orders/${result.orderNumber}`);
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <ol className="flex gap-3 text-sm" aria-label="Checkout steps">
          <li className={step === "details" ? "text-accent" : "text-ink-faint"}>
            1. Shipping details
          </li>
          <li aria-hidden="true" className="text-ink-faint">
            →
          </li>
          <li className={step === "review" ? "text-accent" : "text-ink-faint"}>
            2. Review &amp; pay
          </li>
        </ol>

        {step === "details" ? (
          <form onSubmit={submitDetails} noValidate className="card space-y-4 p-5">
            <Field
              id="fullName"
              label="Full name"
              value={values.fullName}
              error={errors.fullName}
              onChange={(v) => update("fullName", v)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="email"
                label="Email"
                type="email"
                value={values.email}
                error={errors.email}
                onChange={(v) => update("email", v)}
              />
              <Field
                id="phone"
                label="Phone"
                type="tel"
                value={values.phone}
                error={errors.phone}
                onChange={(v) => update("phone", v)}
              />
            </div>
            <Field
              id="addressLine1"
              label="Address line 1"
              value={values.addressLine1}
              error={errors.addressLine1}
              onChange={(v) => update("addressLine1", v)}
            />
            <Field
              id="addressLine2"
              label="Address line 2 (optional)"
              value={values.addressLine2 ?? ""}
              onChange={(v) => update("addressLine2", v)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                id="city"
                label="City"
                value={values.city}
                error={errors.city}
                onChange={(v) => update("city", v)}
              />
              <Field
                id="state"
                label="State / governorate"
                value={values.state}
                error={errors.state}
                onChange={(v) => update("state", v)}
              />
              <Field
                id="postalCode"
                label="Postal code"
                value={values.postalCode}
                error={errors.postalCode}
                onChange={(v) => update("postalCode", v)}
              />
              <Field
                id="country"
                label="Country"
                value={values.country}
                error={errors.country}
                onChange={(v) => update("country", v)}
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              Review order
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <section className="card p-5">
              <h2 className="text-base font-semibold">Shipping to</h2>
              <address className="mt-2 text-sm not-italic leading-relaxed text-ink-soft">
                {values.fullName}
                <br />
                {values.addressLine1}
                {values.addressLine2 ? (
                  <>
                    <br />
                    {values.addressLine2}
                  </>
                ) : null}
                <br />
                {values.city}, {values.state} {values.postalCode}
                <br />
                {values.country}
                <br />
                {values.email} · {values.phone}
              </address>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => setStep("details")}
              >
                Edit details
              </Button>
            </section>

            <section className="card p-5">
              <h2 className="text-base font-semibold">Items</h2>
              <ul className="mt-4 space-y-4">
                {items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3">
                    <div className="relative size-14 overflow-hidden rounded-lg bg-surface-2">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 text-sm">
                      <p className="truncate">{item.name}</p>
                      <p className="text-ink-faint">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {serverError ? (
              <p role="alert" className="text-sm text-danger">
                {serverError}
              </p>
            ) : null}

            <Button className="w-full" disabled={pending} onClick={confirm}>
              {pending ? "Placing order…" : "Confirm and pay"}
            </Button>
            <p className="text-xs text-ink-faint">
              Totals are recalculated on the server from database prices before
              the order is created.
            </p>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <OrderSummary totals={totals} title="Estimated total" />
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="field"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
