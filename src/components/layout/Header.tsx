import Link from "next/link";
import { getCategories } from "@/lib/queries/products";
import { AccountLink } from "@/components/layout/AccountLink";
import { CartBadge } from "@/components/layout/CartBadge";

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="text-xl font-bold text-ink">
              VOLT
            </div>
          </Link>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex items-center gap-8">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-ink-soft hover:text-ink transition-colors duration-200"
                >
                  All Products
                </Link>
              </li>
              {categories.slice(0, 3).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-sm text-ink-soft hover:text-ink transition-colors duration-200"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right section: Auth + Cart */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <AccountLink />
            </div>
            <CartBadge />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav aria-label="Categories" className="lg:hidden border-t border-line">
          <div className="flex gap-4 overflow-x-auto px-0 py-3 text-sm">
            <Link
              href="/products"
              className="flex-shrink-0 text-ink-soft hover:text-ink transition-colors"
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className="flex-shrink-0 text-ink-soft hover:text-ink transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}