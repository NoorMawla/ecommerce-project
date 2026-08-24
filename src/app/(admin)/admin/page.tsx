import Link from "next/link";
import {
  ShoppingBag,
  DollarSign,
  Clock3,
  Package,
  Users,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default async function AdminDashboard() {
  const [
    sales,
    totalOrders,
    pendingOrders,
    totalProducts,
    totalCustomers,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          not: "CANCELLED",
        },
      },
    }),

    prisma.order.count(),

    prisma.order.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.product.count(),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    }),

    prisma.product.findMany({
      take: 5,
      where: {
        stock: {
          lte: 5,
        },
      },
      orderBy: {
        stock: "asc",
      },
    }),
  ]);

  const totalSales = sales._sum.total ?? 0;

  const stats = [
    {
      title: "Total Sales",
      value: formatPrice(totalSales),
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toString(),
      icon: Clock3,
    },
    {
      title: "Products",
      value: totalProducts.toString(),
      icon: Package,
    },
    {
      title: "Customers",
      value: totalCustomers.toString(),
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your VOLT store.
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {stat.title}
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                  <Icon size={18} className="text-gray-700" />
                </div>
              </div>

              <div className="text-2xl font-bold tracking-tight text-gray-950">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTENT GRID */}
      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* RECENT ORDERS */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5">
            <div>
              <h2 className="font-semibold text-gray-950">
                Recent Orders
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Your latest customer orders
              </p>
            </div>

            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black"
            >
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              No orders yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => {
                const itemCount = order.items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );

                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.orderNumber}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-gray-50"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-gray-950">
                        #{order.orderNumber}
                      </div>

                      <div className="mt-1 truncate text-xs text-gray-500">
                        {order.fullName} · {itemCount} item
                        {itemCount !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="font-semibold text-gray-950">
                        {formatPrice(order.total)}
                      </div>

                      <div className="mt-1 text-xs text-gray-400">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* LOW STOCK */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-200 px-5 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-50">
              <AlertTriangle
                size={18}
                className="text-yellow-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-gray-950">
                Low Stock
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Products needing attention
              </p>
            </div>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              All products have healthy stock levels.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStockProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {product.name}
                    </div>

                    <div className="mt-1 text-xs text-gray-400">
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      product.stock === 0
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : `${product.stock} left`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}