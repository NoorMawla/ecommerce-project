import Link from "next/link";
import { getCategories } from "@/lib/queries/products";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  const [categories, session] = await Promise.all([
    getCategories(),
    auth(),
  ]);

  const isAdmin = session?.user?.role === "ADMIN";

  /*
   * An ADMIN can only see the storefront when they explicitly
   * clicked "View Store" from the admin panel.
   */
  const isAdminPreview = isAdmin;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* MAIN HEADER */}
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link
            href={isAdminPreview ? "/?adminPreview=true" : "/"}
            className="flex-shrink-0"
          >
            <div className="text-xl font-bold text-ink">
              VOLT
            </div>
          </Link>

          {/* CENTER NAVIGATION */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 transform lg:flex">
            <ul className="flex items-center gap-8">

              <li>
                <Link
                  href={
                    isAdminPreview
                      ? "/products?adminPreview=true"
                      : "/products"
                  }
                  className="text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                >
                  All Products
                </Link>
              </li>

              {categories.slice(0, 3).map((category) => (
                <li key={category.id}>
                  <Link
                    href={
                      isAdminPreview
                        ? `/categories/${category.slug}?adminPreview=true`
                        : `/categories/${category.slug}`
                    }
                    className="text-sm text-ink-soft transition-colors duration-200 hover:text-ink"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}

            </ul>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {isAdminPreview ? (
              /*
               * ADMIN PREVIEW
               *
               * Instead of "Hi, Admin", show a very obvious
               * way back to the administration panel.
               */
              <Link
                href="/admin"
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                ← Back to Admin
              </Link>
            ) : (
              /*
               * NORMAL CUSTOMER
               */
              <div className="hidden items-center gap-2 sm:flex">
                {session?.user ? (
                  <>
                    <Link
                      href="/account"
                      className="px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                    >
                      Hi,{" "}
                      {session.user.name?.split(" ")[0] ??
                        "Account"}
                    </Link>

                    <SignOutButton />
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/register"
                      className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-light"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* CART */}
            {!isAdminPreview && (
              <Link
                href="/cart"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-colors hover:bg-surface"
                title="Shopping cart"
              >
                🛒
              </Link>
            )}

          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        <nav
          aria-label="Categories"
          className="border-t border-line lg:hidden"
        >
          <div className="flex gap-4 overflow-x-auto px-0 py-3 text-sm">

            <Link
              href={
                isAdminPreview
                  ? "/products?adminPreview=true"
                  : "/products"
              }
              className="flex-shrink-0 text-ink-soft transition-colors hover:text-ink"
            >
              All
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={
                  isAdminPreview
                    ? `/categories/${category.slug}?adminPreview=true`
                    : `/categories/${category.slug}`
                }
                className="flex-shrink-0 text-ink-soft transition-colors hover:text-ink"
              >
                {category.name}
              </Link>
            ))}

          </div>
        </nav>

      </div>
    </header>
  );
}