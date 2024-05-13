"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getGameStartTime } from "@/utils";
import Timer from "@/components/timer/TImer";
import { GAME_DATE, GAME_LENGTH } from "@/utils/constants";

import styles from "./GameTimer.module.css";

const tenMinutes = 10 * 60000;

const GameTimer = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isOnHomePage = pathname === "/";

  // Calculate initial time remaining immediately
  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const gameTime = getGameStartTime(GAME_DATE) + GAME_LENGTH;
    return gameTime - currentTime;
  };

  const [timeRemaining, setTimeRemaining] = useState<number>(calculateTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());

      if (timeRemaining <= 0) {
        clearInterval(interval);

        if (!pathname.includes("gameover")) {
          router.push("/gameover");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining]);

  return (
    isOnHomePage &&
    timeRemaining > 0 && (
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.timer}>
            <Timer timeRemaining={timeRemaining} />
          </div>
          <Image src="/icons/24/timer.svg" alt="timer icon" width={24} height={24} />
        </div>
      </div>
    )
  );
};

export default GameTimer;
