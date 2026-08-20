import { prisma } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct } from "./actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded bg-black text-white px-4 py-2 min-h-[44px] flex items-center"
        >
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products yet. Add your first one.</p>
      ) : (
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
                      <button
                        type="submit"
                        className="text-red-600 underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}