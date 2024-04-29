"use client";

import React from "react";
import Image from "next/image";
import { useUser, useScore, useLeaderboard } from "@/hooks";
import { withCommas } from "@/utils";
import styles from "./TopBar.module.css";

const TopBar: React.FC = () => {
  const user = useUser();
  const { score, boxes } = useScore(user?.id);
  const { userRank } = useLeaderboard(user?.id);

  return (
    <div className={styles.container}>
      <div className={styles.scoreContainer}>
        <div className={styles.title}>Score</div>
        <div className={styles.scoreAmountContainer}>
          <div className={styles.scoreAmount}>{withCommas(score)}</div>
          <Image alt="G Icon" src="/icons/16/g-points.svg" width={16} height={16} />
          <div className={styles.boxAmountContainer}>
            <div className={styles.boxAmount}><span className={styles.grey}>(</span>{boxes}<span className={styles.grey}>)</span></div>
            <Image alt="Box Icon" src="/icons/16/box-closed.svg" width={16} height={16} />
          </div>
        </div>
      </div>

      <div className={styles.scoreContainer}>
        <div className={styles.title}>Rank</div>
        <div className={styles.scoreAmountContainer}>
          <div className={styles.scoreAmount}>{withCommas(userRank || 0)}</div>
          <Image alt="Rank Icon" src="/icons/16/leaderboard.svg" width={16} height={16} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
