"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { QuantityPicker } from "@/components/product/QuantityPicker";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Skeleton } from "@/components/ui/Skeleton";

export function CartView() {
  const { items, setQuantity, remove, totals, ready } = useCart();

  if (!ready) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add a pair of headphones, a charger or a dock and it will show up here — even after a refresh."
        action={<ButtonLink href="/products">Start shopping</ButtonLink>}
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.productId} className="card flex gap-4 p-4">
            <Link
              href={`/products/${item.slug}`}
              className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-surface-2"
            >
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h2 className="text-base font-medium">
                  <Link href={`/products/${item.slug}`}>{item.name}</Link>
                </h2>
                <p className="font-display">
                  {formatLine(item.price * item.quantity)}
                </p>
              </div>
              <p className="text-sm text-ink-faint">
                {formatLine(item.price)} each
              </p>

              <div className="mt-auto flex flex-wrap items-center gap-3">
                <QuantityPicker
                  id={`qty-${item.productId}`}
                  value={item.quantity}
                  max={item.stock}
                  onChange={(next) => setQuantity(item.productId, next)}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => remove(item.productId)}
                >
                  Remove
                </Button>
                {item.quantity >= item.stock ? (
                  <span className="text-xs text-warn">
                    Stock limit reached
                  </span>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
        <OrderSummary totals={totals} />
        <ButtonLink href="/checkout" className="w-full">
          Proceed to checkout
        </ButtonLink>
        <ButtonLink href="/products" variant="ghost" className="w-full">
          Continue shopping
        </ButtonLink>
      </div>
    </div>
  );
}

function formatLine(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
