import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { StockBadge } from "@/components/ui/StockBadge";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: { name: string } | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="card group flex flex-col overflow-hidden hover:card-hover">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface-2"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          priority={false}
        />
        {product.stock <= 0 ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <span className="rounded-full bg-danger px-4 py-2 text-sm font-semibold text-white">
              Sold out
            </span>
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {product.category ? (
          <p className="text-xs uppercase tracking-widest font-semibold text-accent">
            {product.category.name}
          </p>
        ) : null}
        <h3 className="text-lg font-semibold leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="hover:text-accent transition-colors">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-ink-soft leading-relaxed">
          Premium quality, carefully selected
        </p>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-line">
          <span className="font-display text-xl font-bold text-accent">
            {formatPrice(product.price)}
          </span>
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}