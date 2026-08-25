import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminNav() {
  return (
    <nav className="border-b bg-gray-50 px-8 py-3">
      <ul className="flex gap-6 text-sm font-medium">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-gray-600 hover:text-black">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}