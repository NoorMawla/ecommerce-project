// src/app/(auth)/register/actions.ts
"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password || password.length < 8) {
    throw new Error("Invalid input");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  redirect("/login?registered=true");
}