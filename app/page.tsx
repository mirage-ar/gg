"use client";

import React, { useEffect, useState } from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import TopBar from "@/components/navigation/TopBar";
import Walkthrough from "@/components/onboarding/Walkthrough";
import { getSession, signOut } from "next-auth/react";
import { User } from "@/types";

const MapPage: React.FC = () => {
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(false);

  // TODO: needs to be an API call
  useEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      const user = session?.user as User;

      if (user && !user?.id) {
        signOut();
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const hasOnboardedValue = localStorage.getItem("hasOnboarded");
    if (hasOnboardedValue) {
      setHasOnboarded(JSON.parse(hasOnboardedValue));
    }
  }, [hasOnboarded]);

  if (!hasOnboarded) {
    // Show onboarding screens
    return (
      <div>
        <Walkthrough setHasOnboarded={setHasOnboarded} />
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
