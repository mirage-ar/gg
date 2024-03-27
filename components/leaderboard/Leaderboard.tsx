// components/Leaderboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Leaderboard.module.css";

import { useLeaderboard, useUser } from "@/hooks";
import { withCommas } from "@/utils";

const Leaderboard: React.FC = () => {
  const user = useUser();
  const { leaderboard, userRank, userScore } = useLeaderboard(user?.username);

  return (
    <div className={styles.container}>
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

      {/* ------ LEADERBOARD ------ */}
      <div className={styles.leaderboardContainer}>
        <div className={styles.leaderboardHeader}>Leaderboard</div>
        <div className={styles.leaderboardScores}>
          {leaderboard.length > 0 &&
            leaderboard.map((player, index) => (
              player.points > 0 &&
              <div className={styles.leaderboardRow} key={player.id}>
                <div className={styles.playerInfo}>
                  <div className={styles.playerRank}>{index + 1}</div>

                  <Image className={styles.playerImage} src={player.image} alt="User Image" width={150} height={150} />

                  <div className={styles.playerName}>@{player.username}</div>
                </div>
                <div className={styles.playerScore}>{withCommas(player.points)}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
