"use client";

import React, { useState, useEffect } from "react";
import HomeScreenOverlay from "@/components/onboarding/HomeScreenOverlay";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MapChat from "@/components/chat/MapChat";
import TopBar from "@/components/navigation/TopBar";

import type { User } from "@/types";

const MapPage: React.FC = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  console.log("isStandalone", isStandalone);

  useEffect(() => {
    // Check if running in standalone mode on iOS
    if ((window.navigator as any).standalone) {
      setIsStandalone(true);
    }
  }, []);

  return (
    <main>
      {isStandalone ? (
        <>
          <MapChat />
          <TopBar />
          <BottomNavigation />
        </>
      ) : (
        <>
          <HomeScreenOverlay />
        </>
      )}
    </main>
  );
};

export default MapPage;
