import { prisma } from "@/lib/db";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-500 text-sm">
          {orders.length} order{orders.length === 1 ? "" : "s"}
        </p>
      </div>

      {orders.length === 0 ? (
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
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="py-3 pr-4 font-medium">
                  #{order.orderNumber}
                </td>
                <td className="py-3 pr-4">
                  <p>{order.fullName}</p>
                  <p className="text-sm text-gray-500">{order.email}</p>
                </td>
                <td className="py-3 pr-4">
                  {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                </td>
                <td className="py-3 pr-4 font-medium">
                  ${(order.total / 100).toFixed(2)}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[order.status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-sm text-gray-500">
                  {order.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}