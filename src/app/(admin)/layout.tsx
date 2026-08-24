
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  LogOut,
  Zap,
} from "lucide-react";

import { SignOutButton } from "@/components/layout/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-gray-200 bg-white lg:flex lg:flex-col">

          {/* LOGO */}
          <div className="flex h-20 items-center border-b border-gray-200 px-6">
            <Link
              href="/admin"
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">
                <Zap size={19} fill="white" />
              </div>

              <div>
                <div className="text-lg font-bold tracking-tight">
                  VOLT
                </div>

                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Admin Panel
                </div>
              </div>
            </Link>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 px-4 py-6">
            <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Management
            </div>

            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex min-h-[46px] items-center gap-3 rounded-xl px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
                  >
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className="text-gray-400 transition group-hover:text-black"
                    />

                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* SIGN OUT ONLY */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex min-h-[44px] items-center gap-3 rounded-xl px-3 text-sm font-medium text-gray-600">
              <LogOut size={18} />

              <SignOutButton />
            </div>
          </div>

        </aside>

        {/* MAIN */}
        <div className="min-w-0 flex-1">

          {/* TOP BAR */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white/95 px-5 backdrop-blur sm:px-8">

            <div>
              <div className="text-sm font-semibold text-gray-900">
                VOLT Admin
              </div>

              <div className="text-xs text-gray-400">
                Store management
              </div>
            </div>

            <div className="flex items-center gap-3">

              <div className="hidden text-right sm:block">
                <div className="text-sm font-medium text-gray-900">
                  {session.user.name ?? "Administrator"}
                </div>

                <div className="text-xs text-gray-400">
                  Administrator
                </div>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                {(session.user.name ?? "A")
                  .charAt(0)
                  .toUpperCase()}
              </div>

            </div>
          </header>

          {/* MOBILE ADMIN NAV */}
          <div className="border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700"
                  >
                    <Icon size={15} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ADMIN CONTENT */}
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}