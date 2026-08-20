import Link from "next/link";

export function Pagination({
  page,
  pageCount,
  baseParams,
  basePath = "/products",
}: {
  page: number;
  pageCount: number;
  baseParams: Record<string, string | undefined>;
  basePath?: string;
}) {
  if (pageCount <= 1) return null;

  const href = (target: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(baseParams)) if (v) sp.set(k, v);
    if (target > 1) sp.set("page", String(target));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-4"
    >
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:bg-surface-2"
        >
          Previous
        </Link>
      ) : null}

      {Array.from({ length: pageCount }).map((_, i) => {
        const n = i + 1;
        const current = n === page;
        return (
          <Link
            key={n}
            href={href(n)}
            aria-current={current ? "page" : undefined}
            className={`inline-flex size-11 items-center justify-center rounded-full border text-sm ${
              current
                ? "border-accent bg-accent text-accent-ink"
                : "border-line hover:bg-surface-2"
            }`}
          >
            {n}
          </Link>
        );
      })}

      {page < pageCount ? (
        <Link
          href={href(page + 1)}
          className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm hover:bg-surface-2"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
