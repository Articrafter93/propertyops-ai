import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/i18n/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PropertyOps AI — Property Rental Operations",
  description: "No-code + AI platform for end-to-end operations of rooms for rent",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${inter.variable} h-full`}>
      <body className="h-full bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
