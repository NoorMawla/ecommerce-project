"use client";

export function QuantityPicker({
  value,
  max,
  onChange,
  id = "quantity",
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  id?: string;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface-2 p-1">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="size-11 rounded-full text-lg text-ink-soft hover:bg-surface hover:text-ink disabled:opacity-40"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <label className="sr-only" htmlFor={id}>
        Quantity
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (!Number.isNaN(next)) onChange(Math.min(Math.max(1, next), max));
        }}
        className="w-12 bg-transparent text-center text-sm outline-none [appearance:textfield]"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        className="size-11 rounded-full text-lg text-ink-soft hover:bg-surface hover:text-ink disabled:opacity-40"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
