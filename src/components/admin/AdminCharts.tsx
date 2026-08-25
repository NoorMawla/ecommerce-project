"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatPrice } from "@/lib/format";
import type {
  RevenuePoint,
  StatusCount,
  TopProduct,
  CategoryRevenue,
} from "@/lib/queries/admin-analytics";

const PALETTE = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b",
  PAID: "#2563eb",
  SHIPPED: "#7c3aed",
  DELIVERED: "#16a34a",
  CANCELLED: "#dc2626",
};

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RevenueOverTimeChart({ data }: { data: RevenuePoint[] }) {
  const chartData = data.map((d) => ({ ...d, label: formatShortDate(d.date) }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => formatPrice(v)}
          width={70}
        />
        <Tooltip
          formatter={(value: unknown) => [formatPrice(Number(value)), "Revenue"]}
          labelFormatter={(label) => label}
        />
        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function OrdersByStatusChart({ data }: { data: StatusCount[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No orders yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={(entry) => `${entry.name} (${entry.value})`}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#9ca3af"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopProductsChart({ data }: { data: TopProduct[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No sales yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 12 }}
          width={140}
        />
        <Tooltip formatter={(value: unknown) => [Number(value), "Units sold"]} />
        <Bar dataKey="unitsSold" fill="#2563eb" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueByCategoryChart({ data }: { data: CategoryRevenue[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">No sales yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="revenue"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={(entry) => entry.name}
        >
          {data.map((entry, i) => (
            <Cell key={entry.category} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: unknown) => formatPrice(Number(value))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}