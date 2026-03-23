import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medusa - Professional Web Development Services",
  description: "Transform your ideas into digital reality with our professional web development services. From Discord bots to custom applications, starting at just $11.",
  keywords: "web development, discord bots, wordpress, shopify, next.js, react, automation, web scraping",
  authors: [{ name: "Medusa" }],
  openGraph: {
    title: "Medusa - Professional Web Development Services",
    description: "Transform your ideas into digital reality with our professional web development services. From Discord bots to custom applications, starting at just $11.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
