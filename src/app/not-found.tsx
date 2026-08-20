import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-display text-6xl text-accent">404</p>
      <h1 className="text-2xl font-semibold">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-sm text-ink-soft">
        The product may have been removed or the link is mistyped. The full
        catalogue is one click away.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <ButtonLink href="/products">Browse products</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Go home
        </ButtonLink>
      </div>
    </div>
  );
}
