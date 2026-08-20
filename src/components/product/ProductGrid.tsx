import { ProductCard, type ProductCardData } from "@/components/product/ProductCard";

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <ul> 
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </div>
    </ul>
  );
}
