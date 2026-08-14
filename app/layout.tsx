import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Silkscreen, Pixelify_Sans } from "next/font/google";
import DisableZoom from "./components/DisableZoom";
import PixelCursor from "./components/PixelCursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
});

export const metadata: Metadata = {
  title: "Pixel Portfolio",
  description: "Interactive 2D Pixel-Art Game Portfolio",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full bg-[#0b0c10]">
      <body className={`${geistSans.variable} ${geistMono.variable} ${silkscreen.variable} ${pixelify.variable} h-full w-full bg-[#0b0c10] overflow-hidden antialiased`}>
        <DisableZoom />
        <PixelCursor />
        {children}
      </body>
    </html>
  );
}

