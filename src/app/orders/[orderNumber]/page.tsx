import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your VOLT order confirmation and summary.",
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="card grid-glow p-8 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-accent">
          Order confirmed
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Thank you, {order.fullName.split(" ")[0]}!</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Your order number is{" "}
          <span className="font-display text-ink">{order.orderNumber}</span> ·
          placed {formatDate(order.createdAt)}
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          A summary was sent to {order.email}.
        </p>
      </header>

      <section className="card p-5">
        <h2 className="text-base font-semibold">Items</h2>
        <ul className="mt-4 space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative size-14 overflow-hidden rounded-lg bg-surface-2">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate">{item.product.name}</p>
                <p className="text-ink-faint">
                  Qty {item.quantity} ·{" "}
                  {formatPrice(item.unitPriceAtPurchase)} each
                </p>
              </div>
              <p className="text-sm">
                {formatPrice(item.unitPriceAtPurchase * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row
            label="Shipping"
            value={order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
          />
          <Row label="Tax" value={formatPrice(order.tax)} />
          <div className="flex justify-between border-t border-line pt-2 text-base">
            <dt className="font-medium">Total paid</dt>
            <dd className="font-display">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="card p-5">
        <h2 className="text-base font-semibold">Shipping to</h2>
        <address className="mt-2 text-sm not-italic leading-relaxed text-ink-soft">
          {order.fullName}
          <br />
          {order.addressLine1}
          {order.addressLine2 ? (
            <>
              <br />
              {order.addressLine2}
            </>
          ) : null}
          <br />
          {order.city}, {order.state} {order.postalCode}
          <br />
          {order.country}
        </address>
      </section>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/products">Continue shopping</ButtonLink>
        <ButtonLink href="/account" variant="outline">
          View my orders
        </ButtonLink>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-soft">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
