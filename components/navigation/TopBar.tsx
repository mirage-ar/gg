"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useLeaderboard } from "@/hooks";
import { withCommas } from "@/utils";
import styles from "./TopBar.module.css";

const TopBar: React.FC = () => {
  const router = useRouter();

  const user = useUser();
  const { userRank, userScore, userBoxes } = useLeaderboard(user?.id);

  const openLeaderboard = () => {
    router.push("/leaderboard");
  };

  const openProfile = () => {
    router.push("/profile");
  };

  return (
    <div className={styles.container}>
      <div className={styles.scoreContainer} onClick={openProfile}>
        <div className={styles.title}>Score</div>
        <div className={styles.scoreAmountContainer}>
          <div className={styles.scoreAmount}>{withCommas(userScore)}</div>
          <Image alt="G Icon" src="/icons/icons-16/g-points.svg" width={16} height={16} />
          <div className={styles.boxAmountContainer}>
            <div className={styles.boxAmount}>
              <span className={styles.grey}>(</span>
              {userBoxes}
              <span className={styles.grey}>)</span>
            </div>
            <Image alt="Box Icon" src="/icons/icons-16/box-closed.svg" width={16} height={16} />
          </div>
        </div>
      </div>

      <div className={styles.scoreContainer} onClick={openLeaderboard}>
        <div className={styles.title}>Rank</div>
        <div className={styles.scoreAmountContainer}>
          <div className={styles.scoreAmount}>{withCommas(userRank)}</div>
          <Image alt="Rank Icon" src="/icons/icons-16/leaderboard.svg" width={16} height={16} />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
