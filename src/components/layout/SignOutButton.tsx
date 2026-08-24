"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="px-4 py-2 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
    >
      Sign Out
    </button>
  );
}