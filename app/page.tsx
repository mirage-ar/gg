"use client";

import React, { useState, useEffect } from "react";
import HomeScreenOverlay from "@/components/onboarding/HomeScreenOverlay";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MapChat from "@/components/chat/MapChat";
import TopBar from "@/components/navigation/TopBar";

const MapPage: React.FC = () => {
  const [isStandalone, setIsStandalone] = useState(true);
  console.log("isStandalone", isStandalone);

  // TODO: update to use standalone - map too
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
