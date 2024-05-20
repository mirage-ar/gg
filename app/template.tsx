"use client";

import React, { useEffect, useRef } from "react";
import { ApplicationProvider } from "@/state/context";
import GameTimer from "@/components/game/GameTimer";
import { useUser } from "@/hooks";
import { GAME_API } from "@/utils/constants";
import { signOut } from "next-auth/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const user = useUser();

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const response = await fetch(`${GAME_API}/user/${user?.id}`);
        const result = await response.json();

        if (result.success === false) {
          signOut();
        }
      }
    };

    checkUser();
  }, [user]);

  return (
    <div>
      <ApplicationProvider>
        {children}
        <GameTimer />
      </ApplicationProvider>
    </div>
  );
}
