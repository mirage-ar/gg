"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import MapboxMap from "@/components/map/MapboxMap";
import BottomNavigation from "@/components/navigation/BottomNavigation";

export default function HuntLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
        config={{
          loginMethods: ["twitter", "wallet", "google"],

          appearance: {
            theme: "dark",
            showWalletLoginFirst: false,
          },
        }}
      >
        {children}
        <MapboxMap />
        <BottomNavigation />
      </PrivyProvider>
    </>
  );
}
