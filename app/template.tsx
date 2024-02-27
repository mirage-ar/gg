"use client";

import React, { useMemo } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import MapboxMap from "@/components/map/MapboxMap";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PrivyProvider
        appId="clq5sknmv005vld0fk12orbq1"
        config={{
          // Display email and wallet as login methods
          loginMethods: ["twitter"],
          // Customize Privy's appearance in your app
          appearance: {
            theme: "dark",
            accentColor: "#676FFF",
            logo: "https://your-logo-url",
          },
        }}
      >
        <MapboxMap />
        {children}
      </PrivyProvider>
    </div>
  );
}
