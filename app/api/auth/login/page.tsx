"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import HomeScreenOverlay from "@/components/onboarding/HomeScreenOverlay";
import Timer from "@/components/timer/TImer";

import styles from "./page.module.css";

import { getGameStartTime } from "@/utils";
import { GAME_API, GAME_DATE, PLAYER_COUNT } from "@/utils/constants";
import { useUser } from "@/hooks";

const FIVE_MINUTES = 5 * 60 * 1000;
const TWO_MINUTES = 2 * 60 * 1000;

const LoginPage = () => {
  const router = useRouter();
  const user = useUser();

  const [isStandalone, setIsStandalone] = useState(true);
  const [playerCount, setPlayerCount] = useState<number>(0);

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const gameTime = getGameStartTime(GAME_DATE);
    return gameTime - currentTime;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

  // useEffect(() => {
  //   function isRunningStandaloneAndroid() {
  //     return window.matchMedia("(display-mode: standalone)").matches;
  //   }
  
  //   function isRunningStandaloneIOS() {
  //     return (window.navigator as any).standalone === true;
  //   }
  
  //   function isAndroid() {
  //     return /Android/i.test(navigator.userAgent);
  //   }
  
  //   function isIOS() {
  //     return /iPad|iPhone|iPod/.test(navigator.userAgent);
  //   }
  
  //   const isStandalone = isRunningStandaloneAndroid() || isRunningStandaloneIOS();
  //   setIsStandalone(isStandalone);
  // }, [router]);
  

  useEffect(() => {
    // console.log(timeRemaining);
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
        const response = await fetch(`${GAME_API}/players`);
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
  
  // ------ APP OVERLAY ------
  if (!isStandalone) {
    return (
      <main>
        <HomeScreenOverlay />
      </main>
    );
  }

  // ------ TIMER OVERLAY ------
  if (timeRemaining > TWO_MINUTES) {
    return (
      <>
        <div className={styles.container}>
          <div className={styles.logo}>
            <Image src="/graphics/logo-animated.gif" alt="Logo" width={200} height={200} />
          </div>
          <div className={styles.timerContainer}>
            <p>The hunt will start in</p>
            <h3>
              <Timer timeRemaining={timeRemaining} />
            </h3>
          </div>
          <p>May the odds be ever in your favor anon</p>
          <Image src="/icons/icons-24/box-opened.svg" alt="Logo" width={24} height={24} />
        </div>
        <div className={styles.graphicTopLeft}>
          <Image src="/graphics/timer/top-left.svg" alt="graphic" width={40} height={112} />
        </div>
        <div className={styles.graphicTopRight}>
          <Image src="/graphics/timer/top-right.svg" alt="graphic" width={40} height={112} />
        </div>
        <div className={styles.graphicBottomLeft}>
          <Image src="/graphics/timer/bottom-left.svg" alt="graphic" width={40} height={112} />
        </div>
        <div className={styles.graphicBottomRight}>
          <Image src="/graphics/timer/bottom-right.svg" alt="graphic" width={40} height={112} />
        </div>
      </>
    );
  }

  return (
    <>
      <main className={styles.container}>
        <div className={styles.logo}>
          <Image src="/graphics/logo-animated.gif" alt="Logo" width={200} height={200} />
        </div>
        <div className={styles.hunter} onClick={() => handleSignIn()}>
          <Image src="/graphics/hunter-onboarding.svg" alt="Logo" width={367} height={528} />
        </div>

        {playerCount < PLAYER_COUNT || user?.id ? (
          <>
            <h1 className={styles.title}>Start Hunt</h1>

            <button className={styles.button} onClick={() => handleSignIn()}>
              Connect X
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Hunters Locked</h1>
            <p>
              Hunter slection has reached capacity.
              <br />
              Please try again next game.
              <br />
              GG
            </p>
          </>
        )}
      </main>
    </>
  );
};

export default LoginPage;
