import { prisma } from "@/lib/db";

const REVENUE_STATUSES = ["PAID", "SHIPPED", "DELIVERED"] as const;

export type RevenuePoint = { date: string; revenue: number };

/** Revenue per day for the last `days` days (default 14), zero-filled for
 *  days with no orders so the chart doesn't have gaps. */
export async function getRevenueByDay(days = 14): Promise<RevenuePoint[]> {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      status: { in: [...REVENUE_STATUSES] },
      createdAt: { gte: since },
    },
    select: { createdAt: true, total: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + order.total);
  }

  return Array.from(buckets.entries()).map(([date, revenue]) => ({
    date,
    revenue,
  }));
}

export type StatusCount = { status: string; count: number };

export async function getOrdersByStatus(): Promise<StatusCount[]> {
  const grouped = await prisma.order.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return grouped.map((g) => ({ status: g.status, count: g._count.status }));
}

export type TopProduct = { name: string; unitsSold: number };

/** Best sellers by units sold across all orders. */
export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const grouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  if (grouped.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((g) => g.productId) } },
    select: { id: true, name: true },
  });
  const nameById = new Map(products.map((p) => [p.id, p.name]));

  return grouped.map((g) => ({
    name: nameById.get(g.productId) ?? "Deleted product",
    unitsSold: g._sum.quantity ?? 0,
  }));
}

export type CategoryRevenue = { category: string; revenue: number };

/** Revenue split by category, using the price actually paid
 *  (unitPriceAtPurchase), not the product's current price. */
export async function getRevenueByCategory(): Promise<CategoryRevenue[]> {
  const items = await prisma.orderItem.findMany({
    where: { order: { status: { in: [...REVENUE_STATUSES] } } },
    select: {
      quantity: true,
      unitPriceAtPurchase: true,
      product: { select: { category: { select: { name: true } } } },
    },
  });

  const totals = new Map<string, number>();
  for (const item of items) {
    const category = item.product.category.name;
    totals.set(
      category,
      (totals.get(category) ?? 0) + item.quantity * item.unitPriceAtPurchase,
    );
  }

  return Array.from(totals.entries())
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}