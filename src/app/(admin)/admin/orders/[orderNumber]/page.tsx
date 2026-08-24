import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import { updateOrderStatus, deleteOrder } from "../actions";
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

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: {
      orderNumber,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      {/* BACK */}
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Order Details
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-950">
            #{order.orderNumber}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              statusStyles[order.status] ??
              "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>

          <form action={deleteOrder.bind(null, order.id)}>
            <ConfirmDeleteButton label="Delete Order" />
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* ITEMS */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
              <Package size={19} className="text-gray-500" />

              <div>
                <h2 className="font-semibold text-gray-950">
                  Order Items
                </h2>

                <p className="text-xs text-gray-400">
                  Products included in this order
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-6"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <Package size={22} className="text-gray-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-950">
                      {item.product.name}
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
                      Unit price:{" "}
                      {formatPrice(item.unitPriceAtPurchase)}
                    </div>
                  </div>

                  <div className="shrink-0 font-semibold text-gray-950">
                    {formatPrice(
                      item.unitPriceAtPurchase *
                        item.quantity
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CUSTOMER */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <User size={19} className="text-gray-500" />

              <h2 className="font-semibold text-gray-950">
                Customer Information
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Name
                </div>

                <div className="text-sm font-medium text-gray-900">
                  {order.fullName}
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <Mail size={12} />
                  Email
                </div>

                <div className="break-all text-sm text-gray-700">
                  {order.email}
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <Phone size={12} />
                  Phone
                </div>

                <div className="text-sm text-gray-700">
                  {order.phone}
                </div>
              </div>
            </div>
          </section>

          {/* SHIPPING */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <MapPin size={19} className="text-gray-500" />

              <h2 className="font-semibold text-gray-950">
                Shipping Address
              </h2>
            </div>

            <div className="text-sm leading-7 text-gray-700">
              <div className="font-medium text-gray-950">
                {order.fullName}
              </div>

              <div>{order.addressLine1}</div>

              {order.addressLine2 && (
                <div>{order.addressLine2}</div>
              )}

              <div>
                {order.city}, {order.state}{" "}
                {order.postalCode}
              </div>

              <div>{order.country}</div>
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* STATUS */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-gray-950">
              Order Status
            </h2>

            <form
              action={updateOrderStatus.bind(
                null,
                order.id
              )}
            >
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-400">
                Status
              </label>

              <select
                name="status"
                defaultValue={order.status}
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="mt-3 min-h-[46px] w-full rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Update Status
              </button>
            </form>
          </section>

          {/* SUMMARY */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-semibold text-gray-950">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.shipping)}
                </span>
              </div>

              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.tax)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-950">
                    Total
                  </span>

                  <span className="text-xl font-bold text-gray-950">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* DELETE */}
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="mb-3 flex items-center gap-2">
              <Trash2 size={18} className="text-red-600" />

              <h2 className="font-semibold text-red-900">
                Danger Zone
              </h2>
            </div>

            <p className="mb-4 text-sm leading-6 text-red-700">
              Deleting this order is permanent and cannot be
              undone.
            </p>

            <form action={deleteOrder.bind(null, order.id)}>
              <ConfirmDeleteButton label="Delete This Order" />
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}