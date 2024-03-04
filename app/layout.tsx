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
          appId="clq5sknmv005vld0fk12orbq1" // dev
          // appId="clq5ska6s002qld0fpqnk8rmv" // prod
          config={{
            // Display email and wallet as login methods
            loginMethods: ["twitter"],
            // Customize Privy's appearance in your app
            appearance: {
              theme: "dark",
              accentColor: "#676FFF",
              showWalletLoginFirst: false,
              // TODO: add logo
              // logo: "/logo.svg",
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
