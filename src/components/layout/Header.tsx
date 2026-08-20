import Link from "next/link";
import { getCategories } from "@/lib/queries/products";
import { CartBadge } from "@/components/layout/CartBadge";
import { AccountLink } from "@/components/layout/AccountLink";

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-md shadow-sm transition-shadow duration-300">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
      <Link href="/" className="font-display text-2xl font-bold tracking-tight text-ink hover:text-accent transition-colors duration-300 min-w-max">
        VOLT<span className="text-accent">.</span>
      </Link>
        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1 text-sm">
            <li>
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center rounded-full px-3 text-ink-soft hover:bg-surface-2 hover:text-ink"
              >
                All products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/categories/${c.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-ink-soft hover:bg-surface-2 hover:text-ink"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <AccountLink />
          <CartBadge />
        </div>
      </div>

      {/* Mobile category rail — horizontal scroll, never causes page overflow */}
      <nav aria-label="Categories" className="lg:hidden">
        <ul className="flex gap-2 overflow-x-auto px-4 pb-3 text-sm sm:px-6">
          <li>
            <Link
              href="/products"
              className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-line px-3 text-ink-soft"
            >
              All
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/categories/${c.slug}`}
                className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-line px-3 text-ink-soft"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
