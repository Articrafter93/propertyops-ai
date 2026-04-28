import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "PropertyOps AI — Gestión Integral de Alquileres",
  description: "Plataforma no-code + AI para operación integral de habitaciones en alquiler",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <body className="h-full bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
