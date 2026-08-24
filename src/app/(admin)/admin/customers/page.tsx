import { Users, ShoppingBag } from "lucide-react";

import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  return (
    <div className="mx-auto max-w-[1400px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-950">
          Customers
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View customers registered on your VOLT store.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <Users size={19} />
          </div>

          <div>
            <div className="text-2xl font-bold text-gray-950">
              {customers.length}
            </div>

            <div className="text-xs text-gray-500">
              Registered customers
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users
              size={30}
              className="mx-auto mb-3 text-gray-300"
            />

            <p className="text-sm text-gray-500">
              No customers registered yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Orders
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                          {customer.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="font-medium text-gray-950">
                          {customer.name}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {customer.email}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <ShoppingBag size={15} />

                        {customer._count.orders}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-500">
                      {formatDate(customer.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}