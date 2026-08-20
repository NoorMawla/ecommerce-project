import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "My account",
  description: "Your VOLT account details and order history.",
};

export default async function AccountPage() {
  // Middleware already blocks anonymous visitors; this is the server-side
  // double check required by the brief.
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, role: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
  ]);

  if (!user) redirect("/login");

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">My account</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Member since {formatDate(user.createdAt)}
        </p>
      </header>

      <section className="card p-5">
        <h2 className="text-base font-semibold">Details</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-ink-faint">Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-ink-faint">Role</dt>
            <dd>{user.role}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="orders-heading" className="space-y-4">
        <h2 id="orders-heading" className="text-xl font-semibold">
          Order history
        </h2>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Once you place an order it will appear here with its full details."
            action={<ButtonLink href="/products">Browse products</ButtonLink>}
          />
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.orderNumber}`}
                  className="card flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:border-accent/50"
                >
                  <div>
                    <p className="font-display text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-ink-faint">
                      {formatDate(order.createdAt)} ·{" "}
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs text-accent">
                      {order.status}
                    </span>
                    <span className="font-display">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
