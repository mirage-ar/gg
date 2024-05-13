import React from "react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import MapboxMap from "@/components/map/MapboxMap";

import "./globals.css";

import GameTimer from "@/components/game/GameTimer";

export function generateViewport() {
  return {
    themeColor: "#000",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    width: "device-width",
    height: "device-height",
    userScalable: false,
    colorScheme: "dark",
  };
}

export const metadata: Metadata = {
  title: "GG",
  description: "GG",
  // appleWebApp: true, // opens every link in a share page
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body>
        {children}
        <MapboxMap />
        <Analytics />
      </body>
    </html>
  );
}
