"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;

  if (!name || !description || !imageUrl || !categoryId) {
    throw new Error("Missing required fields");
  }
  if (Number.isNaN(price) || price <= 0) {
    throw new Error("Invalid price");
  }
  if (Number.isNaN(stock) || stock < 0) {
    throw new Error("Invalid stock");
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: Math.round(price * 100), // convert dollars to cents
      stock,
      imageUrl,
      categoryId,
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;

  if (!name || !description || !imageUrl || !categoryId) {
    throw new Error("Missing required fields");
  }
  if (Number.isNaN(price) || price <= 0) {
    throw new Error("Invalid price");
  }
  if (Number.isNaN(stock) || stock < 0) {
    throw new Error("Invalid stock");
  }

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Product not found");
  }

  // Only regenerate the slug if the name changed, so we don't break
  // an existing product URL on an unrelated edit (e.g. a stock update).
  let slug = existing.slug;
  if (existing.name !== name) {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const collision = await prisma.product.findFirst({
      where: { slug: baseSlug, NOT: { id } },
    });
    slug = collision ? `${baseSlug}-${id.slice(0, 6)}` : baseSlug;
  }

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price: Math.round(price * 100), // convert dollars to cents
      stock,
      imageUrl,
      categoryId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products");
}