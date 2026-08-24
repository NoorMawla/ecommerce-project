"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const VALID_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export async function updateOrderStatus(
  id: string,
  formData: FormData
) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const status = String(formData.get("status"));

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Invalid order status");
  }

  await prisma.order.update({
    where: {
      id,
    },
    data: {
      status: status as
        | "PENDING"
        | "PAID"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}

export async function deleteOrder(id: string) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.$transaction(async (tx) => {
    await tx.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });

    await tx.order.delete({
      where: {
        id,
      },
    });
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");

  redirect("/admin/orders");
}