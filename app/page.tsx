"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import HomeScreenOverlay from "@/components/onboarding/HomeScreenOverlay";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MapChat from "@/components/chat/MapChat";
import TopBar from "@/components/navigation/TopBar";

const MapPage: React.FC = () => {
  const [isStandalone, setIsStandalone] = useState(true);
  const { user } = usePrivy();
  const router = useRouter();

  // TODO: update to use standalone - map too
  useEffect(() => {
    // check if user is authenticated
    // if (!user) {
    //   router.push("/api/auth/login");
    // }

    // Check if running in standalone mode on iOS
    if ((window.navigator as any).standalone) {
      setIsStandalone(true);
    }
  }, [user, router]);

  return (
    <main>
      {isStandalone ? (
        <>
          {/* <MapChat /> */}
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
