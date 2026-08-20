import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Headphones } from "lucide-react";
import { getFeaturedProducts, getCategories } from "@/lib/queries/products";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="grid-glow absolute inset-0" />

        <div className="relative grid gap-10 px-6 py-16 sm:px-10 lg:grid-cols-2 lg:items-center lg:px-16 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Everyday Electronics
            </p>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Tech that fits your everyday.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
              Discover wireless headphones, chargers, docks, mobile
              accessories and laptop gear built for work, travel and
              everything in between.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
              >
                Shop now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/deals"
                className="inline-flex items-center rounded-xl border border-line bg-surface-2 px-6 py-3 font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                View deals
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-[360px] lg:block">
            <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative flex h-full items-center justify-center">
              <div className="rounded-3xl border border-line bg-surface-2 p-8 shadow-2xl">
                <div className="flex h-56 w-56 items-center justify-center rounded-2xl border border-line bg-bg">
                  <Headphones className="h-28 w-28 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card p-6">
          <Truck className="mb-4 h-7 w-7 text-accent" />

          <h2 className="font-display text-lg font-semibold">
            Fast delivery
          </h2>

          <p className="mt-2 text-sm text-ink-soft">
            Free shipping on orders over $100.
          </p>
        </div>

        <div className="card p-6">
          <ShieldCheck className="mb-4 h-7 w-7 text-accent" />

          <h2 className="font-display text-lg font-semibold">
            12-month warranty
          </h2>

          <p className="mt-2 text-sm text-ink-soft">
            Shop confidently with warranty coverage.
          </p>
        </div>

        <div className="card p-6">
          <Headphones className="mb-4 h-7 w-7 text-accent" />

          <h2 className="font-display text-lg font-semibold">
            Quality electronics
          </h2>

          <p className="mt-2 text-sm text-ink-soft">
            Carefully selected gear for everyday use.
          </p>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Explore
              </p>

              <h2 className="mt-2 font-display text-3xl font-bold">
                Shop by category
              </h2>
            </div>

            <Link
              href="/categories"
              className="hidden items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-accent sm:flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="card group p-6 transition-transform hover:-translate-y-1"
              >
                <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-accent">
                  {category.name}
                </h3>

                <p className="mt-2 text-sm text-ink-soft">
                  {category._count.products}{" "}
                  {category._count.products === 1 ? "product" : "products"}
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-accent">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {products.length > 0 && (
        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                Featured
              </p>

              <h2 className="mt-2 font-display text-3xl font-bold">
                Popular picks
              </h2>
            </div>

            <Link
              href="/products"
              className="hidden items-center gap-2 text-sm font-semibold text-ink-soft transition-colors hover:text-accent sm:flex"
            >
              View all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="card group overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden bg-surface-2">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-faint">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 font-semibold transition-colors group-hover:text-accent">
                    {product.name}
                  </h3>

                  <p className="mt-3 text-xl font-bold text-accent">
                    ${(product.price / 100).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="grid-glow rounded-2xl border border-line p-8 text-center sm:p-12">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Ready to upgrade your setup?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Browse our latest electronics and find the gear that fits your
          everyday.
        </p>

        <Link
          href="/products"
          className="mx-auto mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-ink transition-transform hover:-translate-y-0.5"
        >
          Browse products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}