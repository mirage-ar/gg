"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import MapboxMap from "@/components/map/MapboxMap";

import "./globals.css";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PrivyProvider
          appId="clq5sknmv005vld0fk12orbq1"
          config={{
            // Display email and wallet as login methods
            loginMethods: ["twitter"],
            // Customize Privy's appearance in your app
            appearance: {
              theme: "dark",
              accentColor: "#676FFF",
              // TODO: add logo
              logo: "https://gg.zip/gg-logo.png",
            },
          }}
        >
          <MapboxMap />
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}
