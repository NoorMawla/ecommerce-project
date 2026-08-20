import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCatalogue,
  getCategoryBySlug,
  type ProductSort,
} from "@/lib/queries/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/product/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: category.name,
    description: `Shop ${category.name.toLowerCase()} at VOLT — tested electronics with 12-month warranty.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { products, total, page, pageCount } = await getCatalogue({
    category: slug,
    sort: (sp.sort as ProductSort) ?? "newest",
    page: Number(sp.page) || 1,
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">{category.name}</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </header>

      {products.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          description="This category has no products at the moment. Check the rest of the catalogue in the meantime."
          action={<ButtonLink href="/products">Browse all products</ButtonLink>}
        />
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination
            page={page}
            pageCount={pageCount}
            baseParams={{ sort: sp.sort }}
            basePath={`/categories/${slug}`}
          />
        </>
      )}
    </div>
  );
}
