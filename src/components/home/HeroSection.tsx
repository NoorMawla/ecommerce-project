import { Button, ButtonLink } from "@/components/ui/Button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-3">
              <div className="badge badge-primary bg-warn w-fit">
                Welcome to VOLT
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink">
                Premium Tech Products
              </h1>
              <p className="text-lg text-ink-soft leading-relaxed max-w-lg">
                Discover our curated collection of high-quality electronics, chargers, and tech accessories. Experience luxury at every touchpoint.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <ButtonLink href="/products" variant="primary" size="lg">
                Shop Now
              </ButtonLink>
              <ButtonLink href="/about" variant="outline" size="lg">
                Learn More
              </ButtonLink>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative aspect-square lg:aspect-auto lg:h-96">
            <Image
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
              alt="Hero image"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}