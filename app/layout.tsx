import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/SessionProvider";
import MapboxMap from "@/components/map/MapboxMap";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import { User } from "@/types";

export const metadata: Metadata = {
  title: "GG",
  description: "May the odds be ever in your favor",
  openGraph: {
    title: "GG",
    description: "May the odds be ever in your favor",
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
    description: "May the odds be ever in your favor",
    images: [
      {
        url: "https://gg.zip/og.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
          <MapboxMap />
        </SessionProvider>
      </body>
    </html>
  );
}
