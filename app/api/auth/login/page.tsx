"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import HomeScreenOverlay from "@/components/onboarding/HomeScreenOverlay";
import Timer from "@/components/timer/TImer";

import styles from "./page.module.css";

import { getGameStartTime } from "@/utils";
import { GAME_DATE } from "@/utils/constants";

const LoginPage = () => {
  const router = useRouter();
  const [isStandalone, setIsStandalone] = useState(false);

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const gameTime = getGameStartTime(GAME_DATE);
    return gameTime - currentTime;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

  // TODO: was unable to test
  // useEffect(() => {
  //   function isRunningStandaloneAndroid() {
  //     return window.matchMedia("(display-mode: standalone)").matches;
  //   }

  //   const isStandalone = (window.navigator as any).standalone || isRunningStandaloneAndroid();
  //   setIsStandalone(isStandalone);
  // }, [router]);

  useEffect(() => {
    const isAndroid = /(android)/i.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone || isAndroid;
    // TODO: used for testing
    setIsStandalone(true);
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());

      if (timeRemaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  const handleSignIn = async () => {
    signIn("twitter", { callbackUrl: "/" });
  };

  if (!isStandalone) {
    return (
      <main>
        <HomeScreenOverlay />
      </main>
    );
  }

  if (timeRemaining > 0) {
    return (
      <div className={styles.container}>
        <div className={styles.timerContainer}>
          <p>The hunt will start in</p>
          <h3><Timer timeRemaining={timeRemaining} /></h3>
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
        <h1 className={styles.title}>
          Start Global
          <br />
          Hunt
        </h1>
      </main>
      <button className={styles.button} onClick={() => handleSignIn()}>
        Sign in
      </button>
    </>
  );
};

export default LoginPage;
