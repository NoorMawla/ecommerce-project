import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="transition-colors duration-300 hover:text-accent">
            VOLT<span className="text-accent">.</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-ink-soft">
            Everyday electronics — audio, mobile and laptop gear, tested and
            shipped from Beirut.
          </p>
        </div>

        <nav aria-label="Shop">
          <h2 className="text-sm font-semibold">Shop</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>
              <Link href="/products" className="hover:text-accent transition-colors duration-300">
                All products
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-accent transition-colors duration-300">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-accent transition-colors duration-300">
                My orders
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Support</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>Free shipping over $100</li>
            <li>12-month warranty</li>
            <li>14-day returns</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-4 py-5 text-center text-xs text-ink-faint sm:px-6">
        © {new Date().getFullYear()} VOLT Electronics — trainee project.
      </div>
    </footer>
  );
}
