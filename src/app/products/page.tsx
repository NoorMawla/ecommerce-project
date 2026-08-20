import type { Metadata } from "next";
import { getCatalogue, getCategories, type ProductSort } from "@/lib/queries/products";
import { CatalogueToolbar } from "@/components/product/CatalogueToolbar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/product/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "All products",
  description:
    "Browse every VOLT product: headphones, earbuds, chargers, docks, laptop sleeves and phone accessories.",
};

type SearchParams = {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: string;
};

/** Dollars in the URL -> cents for the database. */
function toCents(value?: string) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : undefined;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const { products, total, page, pageCount } = await getCatalogue({
    q: sp.q,
    category: sp.category,
    minPrice: toCents(sp.min),
    maxPrice: toCents(sp.max),
    sort: (sp.sort as ProductSort) ?? "newest",
    page: Number(sp.page) || 1,
  });

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">All products</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {total} {total === 1 ? "product" : "products"}
          {sp.q ? ` matching “${sp.q}”` : ""}
        </p>
      </header>

      <CatalogueToolbar categories={categories} />

      {products.length === 0 ? (
        <EmptyState
          title="No products match those filters"
          description="Try a different search term, widen the price range, or clear the filters to see the full catalogue."
          action={<ButtonLink href="/products">Clear filters</ButtonLink>}
        />
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination
            page={page}
            pageCount={pageCount}
            baseParams={{
              q: sp.q,
              category: sp.category,
              min: sp.min,
              max: sp.max,
              sort: sp.sort,
            }}
          />
        </>
      )}
    </div>
  );
}
