"use client";

import { Trash2 } from "lucide-react";

export function ConfirmDeleteButton({
  label = "Delete",
}: {
  label?: string;
}) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this order?\n\nThis action cannot be undone."
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600 transition hover:bg-red-100"
    >
      <Trash2 size={16} />
      {label}
    </button>
  );
}