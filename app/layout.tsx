import React from "react";
import type { Metadata, Viewport } from "next";
import MapboxMap from "@/components/map/MapboxMap";

import "./globals.css";

const viewport: Viewport = {
  themeColor: '#000',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  width: 'device-width',
  height: 'device-height',
  userScalable: false,
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: "GG",
  description: "GG",
  appleWebApp: true,
  viewport: viewport,
  themeColor: "#000000",
  openGraph: {
    title: "GG",
    description: "GG",
    url: "https://gg.zip",
    images: [
      {
        url: "https://gg.zip/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "GG",
    description: "GG",
    images: [
      {
        url: "https://gg.zip/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {  
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
