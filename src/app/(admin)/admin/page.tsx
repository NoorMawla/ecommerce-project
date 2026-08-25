import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/format";
import {
  getRevenueByDay,
  getOrdersByStatus,
  getTopProducts,
  getRevenueByCategory,
} from "@/lib/queries/admin-analytics";
import {
  RevenueOverTimeChart,
  OrdersByStatusChart,
  TopProductsChart,
  RevenueByCategoryChart,
} from "@/components/admin/AdminCharts";

const LOW_STOCK_THRESHOLD = 5;

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminDashboard() {
  const [
    orderCount,
    revenueResult,
    lowStockProducts,
    recentOrders,
    revenueByDay,
    ordersByStatus,
    topProducts,
    revenueByCategory,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } },
    }),
    prisma.product.findMany({
      where: { stock: { lte: LOW_STOCK_THRESHOLD } },
      orderBy: { stock: "asc" },
      select: { id: true, name: true, stock: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    getRevenueByDay(14),
    getOrdersByStatus(),
    getTopProducts(5),
    getRevenueByCategory(),
  ]);

  const totalRevenue = revenueResult._sum.total ?? 0;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-gray-500">Total revenue</p>
          <p className="mt-2 text-3xl font-bold">{formatPrice(totalRevenue)}</p>
          <p className="mt-1 text-xs text-gray-400">Paid, shipped &amp; delivered orders</p>
        </div>

        <div className="rounded-lg border p-6">
          <p className="text-sm text-gray-500">Orders</p>
          <p className="mt-2 text-3xl font-bold">{orderCount}</p>
          <Link href="/admin/orders" className="mt-1 inline-block text-xs text-accent hover:underline">
            View all orders
          </Link>
        </div>

        <div className="rounded-lg border p-6">
          <p className="text-sm text-gray-500">Low stock</p>
          <p className="mt-2 text-3xl font-bold">{lowStockProducts.length}</p>
          <p className="mt-1 text-xs text-gray-400">
            Products at {LOW_STOCK_THRESHOLD} units or fewer
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Revenue — last 14 days</h2>
          <RevenueOverTimeChart data={revenueByDay} />
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Orders by status</h2>
          <OrdersByStatusChart data={ordersByStatus} />
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Top-selling products</h2>
          <TopProductsChart data={topProducts} />
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-lg font-semibold">Revenue by category</h2>
          <RevenueByCategoryChart data={revenueByCategory} />
        </div>
      </div>

      {/* Low stock list */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Low stock products</h2>
        {lowStockProducts.length === 0 ? (
          <p className="text-gray-500">Nothing is running low right now.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="py-2 pr-4">Product</th>
                <th className="py-2 pr-4">Stock left</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-3 pr-4">{product.name}</td>
                  <td className="py-3 pr-4">
                    <span className={product.stock === 0 ? "text-red-600 font-medium" : "text-yellow-700"}>
                      {product.stock === 0 ? "Out of stock" : product.stock}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm text-accent hover:underline"
                    >
                      Restock
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent orders */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="py-2 pr-4">Order</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Items</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3 pr-4 font-medium">#{order.orderNumber}</td>
                  <td className="py-3 pr-4">
                    <p>{order.fullName}</p>
                    <p className="text-sm text-gray-500">{order.email}</p>
                  </td>
                  <td className="py-3 pr-4">
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                  </td>
                  <td className="py-3 pr-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusStyles[order.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}