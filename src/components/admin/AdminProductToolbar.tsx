"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Category = { id: string; name: string; slug: string };

/** Search / category / price / sort controls for the admin product list.
 *  Same URL-driven approach as the storefront toolbar, styled to match
 *  the plain admin UI instead of the shop's design tokens. */
export function AdminProductToolbar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function push(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    sp.delete("page");
    router.push(`/admin/products?${sp.toString()}`);
  }

  const hasFilters = ["q", "category", "min", "max", "sort"].some((k) =>
    params.get(k),
  );

  return (
    <div className="mb-6 space-y-4 rounded border p-4">
      <form
        role="search"
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          push({ q });
        }}
      >
        <div className="flex-1">
          <label className="sr-only" htmlFor="admin-product-search">
            Search products by name
          </label>
          <input
            id="admin-product-search"
            type="search"
            className="w-full rounded border px-3 py-2"
            placeholder="Search products by name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="rounded bg-black text-white px-4 py-2 min-h-[44px]"
        >
          Search
        </button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="admin-filter-category">
            Category
          </label>
          <select
            id="admin-filter-category"
            className="w-full rounded border px-3 py-2"
            value={params.get("category") ?? ""}
            onChange={(e) => push({ category: e.target.value })}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="admin-filter-min">
            Min price ($)
          </label>
          <input
            id="admin-filter-min"
            type="number"
            min={0}
            className="w-full rounded border px-3 py-2"
            defaultValue={params.get("min") ?? ""}
            onBlur={(e) => push({ min: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="admin-filter-max">
            Max price ($)
          </label>
          <input
            id="admin-filter-max"
            type="number"
            min={0}
            className="w-full rounded border px-3 py-2"
            defaultValue={params.get("max") ?? ""}
            onBlur={(e) => push({ max: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="admin-filter-sort">
            Sort by
          </label>
          <select
            id="admin-filter-sort"
            className="w-full rounded border px-3 py-2"
            value={params.get("sort") ?? "newest"}
            onChange={(e) => push({ sort: e.target.value })}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </div>

      {hasFilters ? (
        <button
          type="button"
          className="text-sm text-blue-600 underline"
          onClick={() => {
            setQ("");
            router.push("/admin/products");
          }}
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );
}