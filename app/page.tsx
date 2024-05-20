"use client";

import React from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import TopBar from "@/components/navigation/TopBar";
import Walkthrough from "@/components/onboarding/Walkthrough";
import { useApplicationContext } from "@/state/context";

const MapPage: React.FC = () => {
  const { hasOnboarded } = useApplicationContext();

  if (!hasOnboarded) {
    // Show onboarding screens
    return (
      <div>
        <Walkthrough />
      </div>
    );
  }

  return (
    <main>
      <TopBar />
      <BottomNavigation />
    </main>
  );
};

export default MapPage;
