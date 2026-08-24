import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const path = req.nextUrl.pathname;
  const isAdmin = role === "ADMIN";

  const isAdminRoute =
    path === "/admin" || path.startsWith("/admin/");

  /*
   * Admins are allowed to preview the storefront ONLY when
   * they explicitly click "View Store" from the admin panel.
   */
  const isStorePreview =
    req.nextUrl.searchParams.get("adminPreview") === "true";

  /*
   * Protect admin pages.
   */
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL(
        "/login",
        req.nextUrl.origin
      );

      loginUrl.searchParams.set(
        "callbackUrl",
        req.nextUrl.pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    if (!isAdmin) {
      return NextResponse.redirect(
        new URL("/", req.nextUrl.origin)
      );
    }

    return NextResponse.next();
  }

  /*
   * If an ADMIN is logged in and tries to visit the normal
   * storefront without explicitly using View Store,
   * send them back to the admin dashboard.
   */
  if (isLoggedIn && isAdmin && !isStorePreview) {
    return NextResponse.redirect(
      new URL("/admin", req.nextUrl.origin)
    );
  }

  /*
   * Normal customers can access the storefront.
   * Admins can access it only in preview mode.
   */
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};