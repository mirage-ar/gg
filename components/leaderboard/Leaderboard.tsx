// components/Leaderboard.tsx
"use client";

import React from "react";
import Image from "next/image";
import styles from "./Leaderboard.module.css";

import { useLeaderboard, useUser } from "@/hooks";
import { withCommas } from "@/utils";

const Leaderboard: React.FC = () => {
  const user = useUser();
  const { leaderboard, userRank, userScore } = useLeaderboard(user?.username);

  return (
    <div className={styles.container}>


      {/* ------ LEADERBOARD ------ */}
      <div className={styles.leaderboardContainer}>
        <div className={styles.leaderboardHeader}>
          Leaderboard
          <Image src="/icons/24/g.svg" alt="G" width={24} height={24} />
        </div>
        <div className={styles.leaderboardScores}>

          {/* ------ USER ROW ------ */}
          <div className={`${styles.leaderboardRow} ${styles.highlighted}`}>
            <div className={styles.playerInfo}>
              <div className={styles.playerRank}>{userRank}</div>

              <Image className={styles.playerImage} src={user?.image || ""} alt="User Image" width={150} height={150} />

              <div className={styles.playerName}>@{user?.username}</div>
            </div>
            <div className={styles.playerScore}>{withCommas(userScore || 0)}</div>
          </div>

          {/* ------ OTHER PLAYERS ROWS ------ */}
          {leaderboard.length > 0 &&
            leaderboard.map(
              (player, index) =>
                player.points > 0 && (
                  <div className={styles.leaderboardRow} key={player.id}>
                    <div className={styles.playerInfo}>
                      <div className={styles.playerRank}>{index + 1}</div>

                      <Image
                        className={styles.playerImage}
                        src={player.image}
                        alt="User Image"
                        width={150}
                        height={150}
                      />

                      <div className={styles.playerName}>@{player.username}</div>
                    </div>
                    <div className={styles.playerScore}>{withCommas(player.points)}</div>
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
