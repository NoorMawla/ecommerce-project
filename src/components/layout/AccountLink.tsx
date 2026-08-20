"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

/** Uses the session set up (SessionProvider + NextAuth). */
export function AccountLink() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="px-3 text-sm text-ink-faint">…</span>;
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-ink-soft hover:bg-surface-2 hover:text-ink"
      >
        Sign in
      </Link>
    );
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
    </>
  );
}
