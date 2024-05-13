"use client";

import React from "react";
import { ApplicationProvider } from "@/state/context";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ApplicationProvider>{children}</ApplicationProvider>
    </div>
  );
}
