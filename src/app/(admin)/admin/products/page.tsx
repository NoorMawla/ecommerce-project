import Image from "next/image";
import Link from "next/link";
import { deleteProduct } from "./actions";
import { getCatalogue, getCategories, type ProductSort } from "@/lib/queries/products";
import { AdminProductToolbar } from "@/components/admin/AdminProductToolbar";
import { Pagination } from "@/components/product/Pagination";

type SearchParams = {
  q?: string;
  category?: string;
  min?: string;
  max?: string;
  sort?: string;
  page?: string;
};

function toCents(value?: string) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : undefined;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const [{ products, total, page, pageCount }, categories] = await Promise.all([
    getCatalogue({
      q: sp.q,
      category: sp.category,
      minPrice: toCents(sp.min),
      maxPrice: toCents(sp.max),
      sort: (sp.sort as ProductSort) ?? "newest",
      page: Number(sp.page) || 1,
    }),
    getCategories(),
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500 text-sm">
            {total} {total === 1 ? "product" : "products"}
            {sp.q ? ` matching "${sp.q}"` : ""}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded bg-black text-white px-4 py-2 min-h-[44px] flex items-center"
        >
          Add Product
        </Link>
      </div>

      <AdminProductToolbar categories={categories} />

      {products.length === 0 ? (
        <p className="text-gray-500">
          {total === 0 && !sp.q && !sp.category && !sp.min && !sp.max
            ? "No products yet. Add your first one."
            : "No products match those filters."}
        </p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="py-2 pr-4">Image</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Stock</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-3 pr-4">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="py-3 pr-4">{product.name}</td>
                  <td className="py-3 pr-4">{product.category.name}</td>
                  <td className="py-3 pr-4">
                    ${(product.price / 100).toFixed(2)}
                  </td>
                  <td className="py-3 pr-4">
                    {product.stock === 0 ? (
                      <span className="text-red-600">Out of stock</span>
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteProduct.bind(null, product.id)}>
                        <button type="submit" className="text-red-600 underline">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6">
            <Pagination
              page={page}
              pageCount={pageCount}
              basePath="/admin/products"
              baseParams={{
                q: sp.q,
                category: sp.category,
                min: sp.min,
                max: sp.max,
                sort: sp.sort,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}