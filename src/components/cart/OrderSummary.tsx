import { formatPrice } from "@/lib/format";
import type { Totals } from "@/lib/totals";

export function OrderSummary({
  totals,
  title = "Order summary",
}: {
  totals: Totals;
  title?: string;
}) {
  return (
    <section aria-labelledby="summary-heading" className="card p-5">
      <h2 id="summary-heading" className="text-base font-semibold">
        {title}
      </h2>
      <dl className="mt-4 space-y-3 text-sm">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        <Row
          label="Shipping"
          value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
        />
        <Row label="Tax (11%)" value={formatPrice(totals.tax)} />
        <div className="flex items-center justify-between border-t border-line pt-3 text-base">
          <dt className="font-medium">Total</dt>
          <dd className="font-display text-lg font-semibold text-ink">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-soft">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
