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