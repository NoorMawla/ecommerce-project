import { prisma } from "@/lib/db";
import { createProduct } from "../actions";
import ImageDropzone from "@/components/admin/ImageDropzone";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <form action={createProduct} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (USD)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="stock" className="block text-sm font-medium mb-1">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              required
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium mb-1"
          >
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <ImageDropzone name="imageUrl" />

        <button
          type="submit"
          className="rounded bg-black text-white px-4 py-2 min-h-[44px]"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}