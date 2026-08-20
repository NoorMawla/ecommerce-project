"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    imageUrl: string;
  };
  quantity?: number;
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

export function AddToCartButton({
  product,
  quantity = 1,
  label = "Add to cart",
  size = "md",
  className = "",
}: Props) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const atStockLimit = inCart >= product.stock;
  const soldOut = product.stock <= 0;

  if (soldOut) {
    return (
      <Button variant="outline" size={size} className={className} disabled>
        Out of stock
      </Button>
    );
  }

  return (
    <Button
      size={size}
      className={className}
      disabled={atStockLimit}
      onClick={() => {
        add(
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            stock: product.stock,
          },
          quantity,
        );
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {atStockLimit ? "Max in cart" : added ? "Added ✓" : label}
    </Button>
  );
}
