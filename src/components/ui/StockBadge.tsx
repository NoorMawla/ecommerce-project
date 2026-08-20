export function StockBadge({ stock }: { stock: number }) {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-danger">
          Out of stock
        </span>
      );
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-warn">
          Only {stock} left
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-accent">
        In stock
      </span>
    );
  }