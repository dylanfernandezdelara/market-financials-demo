import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Markets · Dashboard",
  description:
    "Stock market dashboard with portfolio tracking, market pulse, equity research, and detailed stock profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${monoFont.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#fafafa] text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
