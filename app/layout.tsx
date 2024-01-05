"use client";

import React, { useEffect, useState } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import MapboxMap from "@/components/map/MapboxMap";

import "./globals.css";

// export const metadata: Metadata = {
//   title: "GG",
//   description: "GG",
//   appleWebApp: true,
//   manifest: "/manifest.json",
//   viewport: "width=device-width, initial-scale=1.0, user-scalable=no",
//   themeColor: "#000000",
//   openGraph: {
//     title: "GG",
//     description: "GG",
//     url: "https://gg.zip",
//     images: [
//       {
//         url: "https://gg.zip/og.png",
//         width: 1200,
//         height: 630,
//       },
//     ],
//   },
//   twitter: {
//     card: "summary",
//     title: "GG",
//     description: "GG",
//     images: [
//       {
//         url: "https://gg.zip/og.png",
//         width: 1200,
//         height: 630,
//       },
//     ],
//   },
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isStandalone, setIsStandalone] = useState(false);
  console.log("isStandalone", isStandalone);

  useEffect(() => {
    // Check if running in standalone mode on iOS
    if ((window.navigator as any).standalone) {
      setIsStandalone(true);
    }
  }, []);
  
  return (
    <html lang="en">
      <body>
        {children}
        <MapboxMap />
      </body>
    </html>
  );
}
