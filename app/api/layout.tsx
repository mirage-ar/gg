"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
        config={{
          loginMethods: ["twitter", "wallet"],

          appearance: {
            theme: "dark",
            showWalletLoginFirst: false,
          },
        }}
      >
        {children}
      </PrivyProvider>
    </>
  );
}
