"use client";

import React, { useEffect } from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import TopBar from "@/components/navigation/TopBar";
import Walkthrough from "@/components/onboarding/Walkthrough";
import { signOut } from "next-auth/react";
import { API } from "@/utils/constants";
import { useUser } from "@/hooks";
import { useApplicationContext } from "@/state/context";

const MapPage: React.FC = () => {
  const user = useUser();
  const { hasOnboarded } = useApplicationContext();

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const result = await fetch(`${API}/user/${user?.id}`);
        const data = await result.json();

        if (data.error) {
          signOut();
        }
      }
    };

    checkUser();
  }, [user]);

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
