import type { Metadata } from "next";
import "./globals.css";
import { brand } from "./fonts/brand";
import { AuthProvider } from "@/components/lib/authentication/auth";

export const metadata: Metadata = {
  title: "Storma",
  description: "Storma — multi-agent playground for entrepreneurs",
   icons: {
    icon: "/storma.png",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={brand.variable}>
      <body className="antialiased min-h-dvh bg-neutral-950 text-neutral-100 font-brand">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}