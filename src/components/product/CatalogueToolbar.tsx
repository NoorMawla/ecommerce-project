"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Category = { id: string; name: string; slug: string };

/** Search / category / price / sort controls. Everything lives in the URL so
 *  the server can do the filtering and the page stays shareable. */
export function CatalogueToolbar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function push(next: Record<string, string>) {
    const sp = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    sp.delete("page"); // any filter change resets pagination
    router.push(`/products?${sp.toString()}`);
  }

  const hasFilters = ["q", "category", "min", "max", "sort"].some((k) =>
    params.get(k),
  );

  return (
    <div className="card flex flex-col gap-4 p-4">
      <form
        role="search"
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          push({ q });
        }}
      >
        <div className="flex-1 text-base">
          <label className="sr-only" htmlFor="product-search">
            Search products by name
          </label>
          <input
            id="product-search"
            name="q"
            type="search"
            className="field"
            placeholder="Search headphones, chargers, laptops…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="field-label" htmlFor="filter-category">
            Category
          </label>
          <select
            id="filter-category"
            className="field"
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
          <label className="field-label" htmlFor="filter-min">
            Min price ($)
          </label>
          <input
            id="filter-min"
            type="number"
            min={0}
            className="field"
            defaultValue={params.get("min") ?? ""}
            onBlur={(e) => push({ min: e.target.value })}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="filter-max">
            Max price ($)
          </label>
          <input
            id="filter-max"
            type="number"
            min={0}
            className="field"
            defaultValue={params.get("max") ?? ""}
            onBlur={(e) => push({ max: e.target.value })}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="filter-sort">
            Sort by
          </label>
          <select
            id="filter-sort"
            className="field"
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
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQ("");
              router.push("/products");
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : null}
    </div>
  );
}