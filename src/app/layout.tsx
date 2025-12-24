import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "NontonCDrama - Streaming Drama China Sub Indo Gratis",
    template: "%s | NontonCDrama",
  },
  description:
    "Nonton drama China terbaru dan trending subtitle Indonesia gratis. Koleksi lengkap mulai dari genre romantis, aksi, hingga fantasi. Update setiap hari!",
  keywords: [
    "drama china",
    "cdrama",
    "nonton drakor",
    "chinese drama sub indo",
    "streaming drama",
    "nontoncdrama",
  ],
  authors: [{ name: "NontonCDrama Team" }],
  openGraph: {
    title: "NontonCDrama - Streaming Drama China Sub Indo Gratis",
    description:
      "Nonton drama China terbaru dan trending subtitle Indonesia gratis. Update setiap hari!",
    url: "https://nontoncdrama.com",
    siteName: "NontonCDrama",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NontonCDrama - Streaming Drama China Sub Indo",
    description:
      "Nonton drama China terbaru dan trending subtitle Indonesia gratis.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
