// middleware.ts (project root, next to package.json)
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const path = req.nextUrl.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isAccountRoute = path.startsWith("/account");

  if (!isLoggedIn && (isAdminRoute || isAccountRoute)) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};