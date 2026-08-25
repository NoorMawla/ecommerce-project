"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { clearCart } from "@/lib/cart-store";

/** Uses the session set up (SessionProvider + NextAuth). */
export function AccountLink() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="px-3 text-sm text-ink-faint">…</span>;
  }

  if (!session?.user) {
    return (
      <>
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-ink-soft hover:bg-surface-2 hover:text-ink"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="inline-flex min-h-11 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-accent-light"
        >
          Sign up
        </Link>
      </>
    );
  }

  async function handleLogout() {
    // Clear the (localStorage, per-browser) cart before signing out so the
    // next person to log in on this browser doesn't inherit this cart.
    clearCart();
    await signOut({ callbackUrl: "/" });
  }

  return (
    <>
      {session.user.role === "ADMIN" ? (
        <Link
          href="/admin"
          className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-accent hover:bg-surface-2"
        >
          Admin
        </Link>
      ) : null}
      <Link
        href="/account"
        className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-ink-soft hover:bg-surface-2 hover:text-ink"
      >
        Account
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-ink-soft hover:bg-surface-2 hover:text-ink"
      >
        Log out
      </button>
    </>
  );
}