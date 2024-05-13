"use client";

import React from "react";
import { ApplicationProvider } from "@/state/context";
import GameTimer from "@/components/game/GameTimer";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ApplicationProvider>
        {children}
        <GameTimer />
      </ApplicationProvider>
    </div>
  );
}
