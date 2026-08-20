import { prisma } from "@/lib/db";

export const PAGE_SIZE = 12;

export type ProductSort = "newest" | "price-asc" | "price-desc";

export type CatalogueParams = {
  q?: string;
  category?: string; // category slug
  minPrice?: number; // cents
  maxPrice?: number; // cents
  sort?: ProductSort;
  page?: number;
};

function orderBy(sort: ProductSort | undefined) {
  if (sort === "price-asc") return { price: "asc" as const };
  if (sort === "price-desc") return { price: "desc" as const };
  return { createdAt: "desc" as const };
}

/** Server-side search + filter + sort + pagination. No client-side arrays. */
export async function getCatalogue(params: CatalogueParams) {
  const page = Math.max(1, params.page ?? 1);

  const where = {
    ...(params.q
      ? { name: { contains: params.q, mode: "insensitive" as const } }
      : {}),
    ...(params.category ? { category: { slug: params.category } } : {}),
    ...(params.minPrice !== undefined || params.maxPrice !== undefined
      ? {
          price: {
            ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}),
            ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}),
          },
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: orderBy(params.sort),
      include: { category: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getFeaturedProducts(take = 8) {
  return prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take,
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    include: { category: true },
    take: 4,
  });
}
