import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
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
    "Audio, mobile and laptop gear. Wireless headphones, chargers, docks and accessories with 12-month warranty and free shipping over $100.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <AuthSessionProvider>
          <CartProvider>
            <Header />

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-8 sm:py-16">
              {children}
            </main>

            <Footer />
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
