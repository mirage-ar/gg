"use client";

// import MapboxMap from "@/components/map/MapboxMap";
// import BottomNavigation from "@/components/navigation/BottomNavigation";
// import { PrivyProvider } from "@privy-io/react-auth";
import { Suspense } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </>
  );
}
