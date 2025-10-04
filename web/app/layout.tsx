import type { Metadata } from "next";
import "./globals.css";
import { brand } from "./fonts/brand";
import { AuthProvider } from "@/components/lib/authentication/auth";

export const metadata: Metadata = {
  title: "Storma",
  description: "Storma — multi-agent playground for entrepreneurs",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={brand.variable}>
      <body className="min-h-dvh bg-neutral-950 text-neutral-100 antialiased font-[var(--font-brand)]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}