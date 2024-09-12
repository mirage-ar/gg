"use client";

import React from "react";
import Image from "next/image";

import styles from "./page.module.css";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import { useLeaderboard, useUser } from "@/hooks";

const GameOverPage: React.FC = () => {
  const user = useUser();
  const { userRank, userScore, userBoxes } = useLeaderboard(user?.id);
  
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src="/icons/logo-animated.gif" alt="Logo" width={176} height={176} />
      </div>

      <div className={styles.titleContainer}>
        <h1>
          Game
          <br />
          Over
        </h1>
        <span className={styles.spacer} />

        <div className={styles.scoreContainer}>
          <div className={styles.scoreRow}>
            <h3>Score</h3>
            <div className={styles.amount}>
              <span>{userScore}</span>
              {/* <Image src="/icons/icons-24/g.svg" alt="Coin" width={24} height={24} /> */}
              <Image src="/icons/coins/wya-24.png" alt="Coin" width={24} height={24} />

            </div>
          </div>

          <div className={styles.scoreRow}>
            <h3>Boxes</h3>
            <div className={styles.amount}>
              <span>{userBoxes}</span>
              <Image src="/icons/icons-24/box-opened.svg" alt="Coin" width={24} height={24} />
            </div>
          </div>

          <div className={styles.scoreRow}>
            <h3>Rank</h3>
            <div className={styles.amount}>
              <span>{userRank}</span>
              <Image src="/icons/icons-24/chart.svg" alt="Coin" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>

      {/* LEADERBOARD */}
      <Leaderboard />
    </div>
  );
};

export default GameOverPage;
