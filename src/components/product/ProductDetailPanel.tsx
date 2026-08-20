"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { StockBadge } from "@/components/ui/StockBadge";
import { QuantityPicker } from "@/components/product/QuantityPicker";
import { AddToCartButton } from "@/components/product/AddToCartButton";

/** Client island: quantity state + add to cart. Page itself stays a Server Component. */
export function ProductDetailPanel({
  product,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    category: { name: string; slug: string };
  };
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-ink-faint">
          {product.category.name}
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{product.name}</h1>
        <div className="flex items-center gap-4">
          <span className="font-display text-2xl">
            {formatPrice(product.price)}
          </span>
          <StockBadge stock={product.stock} />
        </div>
      </div>

      <p className="max-w-prose leading-relaxed text-ink-soft">
        {product.description}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {product.stock > 0 ? (
          <QuantityPicker
            value={quantity}
            max={product.stock}
            onChange={setQuantity}
          />
        ) : null}
        <AddToCartButton product={product} quantity={quantity} />
      </div>

      <dl className="grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm">
        <div>
          <dt className="text-ink-faint">Free shipping</dt>
          <dd>On orders over $100</dd>
        </div>
        <div>
          <dt className="text-ink-faint">Warranty</dt>
          <dd>12 months</dd>
        </div>
      </dl>
    </div>
  );
}
