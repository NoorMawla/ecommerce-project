import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";

import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import { updateOrderStatus, deleteOrder } from "./actions";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";

const STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
    },
  });

  const pending = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const paid = orders.filter(
    (order) => order.status === "PAID"
  ).length;

  const shipped = orders.filter(
    (order) => order.status === "SHIPPED"
  ).length;

  const delivered = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const cancelled = orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;

  const summary = [
    ["All Orders", orders.length],
    ["Pending", pending],
    ["Paid", paid],
    ["Shipped", shipped],
    ["Delivered", delivered],
    ["Cancelled", cancelled],
  ];

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage and track customer orders.
        </p>
      </div>

      {/* SUMMARY */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {summary.map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="text-xs font-medium text-gray-500">
              {label}
            </div>

            <div className="mt-2 text-2xl font-bold text-gray-950">
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Trash2 size={20} className="text-gray-400" />
            </div>

            <h2 className="font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Orders will appear here when customers place them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Items
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const itemCount = order.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-5">
                        <Link
                          href={`/admin/orders/${order.orderNumber}`}
                          className="font-semibold text-gray-950 hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                      </td>

                      <td className="px-5 py-5">
                        <div className="font-medium text-gray-900">
                          {order.fullName}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                          {order.email}
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-600">
                        {itemCount}
                      </td>

                      <td className="px-5 py-5 font-semibold text-gray-950">
                        {formatPrice(order.total)}
                      </td>

                      <td className="px-5 py-5">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                              statusStyles[order.status] ??
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>

                          <form
                            action={updateOrderStatus.bind(
                              null,
                              order.id
                            )}
                            className="flex items-center gap-2"
                          >
                            <select
                              name="status"
                              defaultValue={order.status}
                              className="h-9 rounded-lg border border-gray-200 bg-white px-2 text-xs"
                            >
                              {STATUSES.map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              ))}
                            </select>

                            <button
                              type="submit"
                              className="h-9 rounded-lg bg-black px-3 text-xs font-medium text-white hover:bg-gray-800"
                            >
                              Update
                            </button>
                          </form>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/orders/${order.orderNumber}`}
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            <Eye size={14} />
                            View
                          </Link>

                          <form
                            action={deleteOrder.bind(
                              null,
                              order.id
                            )}
                          >
                            <ConfirmDeleteButton />
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}