import React from "react";
import Image from "next/image";

import styles from "./page.module.css";
import Leaderboard from "@/components/leaderboard/Leaderboard";

const GameOverPage: React.FC = () => {
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
              <span>1000</span>
              <Image src="/icons/24/g.svg" alt="Coin" width={24} height={24} />
            </div>
          </div>

          <div className={styles.scoreRow}>
            <h3>Boxes</h3>
            <div className={styles.amount}>
              <span>202</span>
              <Image src="/icons/24/box-opened.svg" alt="Coin" width={24} height={24} />
            </div>
          </div>

          <div className={styles.scoreRow}>
            <h3>Rank</h3>
            <div className={styles.amount}>
              <span>1000</span>
              <Image src="/icons/24/chart.svg" alt="Coin" width={24} height={24} />
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
