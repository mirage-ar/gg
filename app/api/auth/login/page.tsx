"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import HomeScreenOverlay from "@/components/onboarding/HomeScreenOverlay";
import Timer from "@/components/timer/TImer";

import styles from "./page.module.css";

import { getGameStartTime } from "@/utils";
import { API, GAME_DATE, PLAYER_COUNT } from "@/utils/constants";
import { useUser } from "@/hooks";

const LoginPage = () => {
  const router = useRouter();
  const user = useUser();

  const [isStandalone, setIsStandalone] = useState(false);
  const [playerCount, setPlayerCount] = useState<number>(0);

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const gameTime = getGameStartTime(GAME_DATE);
    return gameTime - currentTime;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

  useEffect(() => {
    function isRunningStandaloneAndroid() {
      return window.matchMedia("(display-mode: standalone)").matches;
    }

    const isStandalone = (window.navigator as any).standalone || isRunningStandaloneAndroid();
    setIsStandalone(isStandalone);
  }, [router]);

  useEffect(() => {
    console.log(timeRemaining);
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());

      if (timeRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  useEffect(() => {
    const getPlayerCount = async () => {
      try {
        const response = await fetch(`${API}/players`);
        const data = await response.json();
        setPlayerCount(data);
      } catch (error) {
        console.error(error);
      }
    };

    getPlayerCount();
  }, []);

  const handleSignIn = async () => {
    signIn("twitter", { callbackUrl: "/" });
  };

  // if (!isStandalone) {
  //   return (
  //     <main>
  //       <HomeScreenOverlay />
  //     </main>
  //   );
  // }

  if (timeRemaining > 5 * 60 * 1000) { // TODO: move this to a constant 
    return (
      <div className={styles.container}>
        <div className={styles.timerContainer}>
          <p>The hunt will start in</p>
          <h3>
            <Timer timeRemaining={timeRemaining} />
          </h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className={styles.container}>
        <div className={styles.logo}>
          <Image src="/icons/logo.svg" alt="Logo" width={176} height={176} />
        </div>
        <div className={styles.hunter} onClick={() => handleSignIn()}>
          <Image src="/graphics/hunter-onboarding.svg" alt="Logo" width={367} height={528} />
        </div>

        {playerCount < PLAYER_COUNT || user?.id ? (
          <>
            <h1 className={styles.title}>
              Start Global
              <br />
              Hunt
            </h1>

            <button className={styles.button} onClick={() => handleSignIn()}>
              Connect X
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Hunters Locked</h1>
            <p>Hunter slection has reached capacity.<br />Please try again next game.<br />GG</p>
          </>
        )}
      </main>
    </>
  );
};

export default LoginPage;
