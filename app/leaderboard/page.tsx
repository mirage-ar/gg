"use client";

import React from "react";
import Image from "next/image";
import PageHeader from "@/components/navigation/PageHeader";
import Leaderboard from "@/components/leaderboard/Leaderboard";

import styles from "./page.module.css";
import { useLeaderboard, useUser } from "@/hooks";

import { withCommas } from "@/utils";

const LeaderboardPage: React.FC = () => {
  const user = useUser();
  const { leaderboard, userRank, userScore } = useLeaderboard(user?.id);

  return (
    <main className={styles.container}>
      <PageHeader />
      <div className={styles.header}>
        {user?.image && (
          <div className={styles.userMarker}>
            <Image className={styles.userImage} src={user.image} alt="User Image" width={150} height={150} />
          </div>
        )}
      </div>
      <div className={styles.scoreContainer}>
        {/* ------ USER RANK ------ */}
        <div className={styles.scoreRow}>
          <div className={styles.scoreLabel}>Rank</div>
          <div className={styles.scoreValue}>
            {userRank}/{leaderboard.length}
          </div>
        </div>
        {/* ------ USER SCORE ------ */}
        <div className={styles.scoreRow}>
          <div className={styles.scoreLabel}>Score</div>
          <div className={styles.scoreValue}>{withCommas(userScore || 0)}</div>
        </div>
        {/* ------ PRIZE POOL ------ */}
        {/* <div className={styles.scoreRow}>
          <div className={styles.scoreLabel}>Prize Pool</div>
          <div className={styles.scoreValue}>{150}</div>
        </div> */}
      </div>

      <Leaderboard />
    </main>
  );
};

export default LeaderboardPage;
