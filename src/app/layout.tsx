import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { headers } from "next/headers";

import "./globals.css";

import AuthSessionProvider from "@/components/shared/SessionProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: {
    default: "VOLT — Everyday Electronics",
    template: "%s · VOLT",
  },
  description:
    "Audio, mobile and laptop gear. Wireless headphones, chargers, docks and accessories.",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const requestHeaders = await headers();
  const isAdminRoute = requestHeaders.get("x-admin-route") === "1";

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body
        className={`min-h-full overflow-x-hidden ${
          isAdminRoute
            ? "bg-[#f7f7f8]"
            : "flex flex-col bg-white"
        }`}
      >
        <AuthSessionProvider>
          <CartProvider>
            {isAdminRoute ? (
              children
            ) : (
              <>
                <Header />

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-8 sm:py-16">
                  {children}
                </main>

                <Footer />
              </>
            )}
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}