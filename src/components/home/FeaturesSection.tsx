import { ShieldCheckIcon, SparklesIcon, TruckIcon, HeartIcon } from "@heroicons/react/24/outline";

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Quality Products",
    description: "Carefully selected premium tech products",
  },
  {
    icon: TruckIcon,
    title: "Free Delivery",
    description: "Fast and free shipping on all orders",
  },
  {
    icon: SparklesIcon,
    title: "Easy Returns",
    description: "Hassle-free returns within 30 days",
  },
  {
    icon: HeartIcon,
    title: "Customer Support",
    description: "24/7 dedicated customer support",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 bg-surface-2">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card p-6 sm:p-8 text-center hover:card-hover"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-ink-soft">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}