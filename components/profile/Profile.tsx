"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Profile.module.css";

import { useLeaderboard, usePoints, useUser } from "@/hooks";

const Profile: React.FC = () => {
  const user = useUser();
  const { points, boxes } = usePoints(user?.username);
  const { leaderboard, userRank } = useLeaderboard(user?.username);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userMarker}>
          <Image className={styles.userImage} src={user?.image || ""} alt="User Image" width={150} height={150} />
        </div>
        <div className={styles.userName}>@{user?.username}</div>
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
          <div className={styles.scoreValue}>{points}</div>
        </div>
        {/* ------ USER BOXES ------ */}
        <div className={styles.scoreRow}>
          <div className={styles.scoreLabel}>Boxes</div>
          <div className={styles.scoreValue}>{boxes}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
