"use client";

import React from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import styles from "./Profile.module.css";

import { useLeaderboard, useUser } from "@/hooks";
import { withCommas } from "@/utils";

const Profile: React.FC = () => {
  const user = useUser();
  const { leaderboard, userRank, userScore, userBoxes } = useLeaderboard(user?.id);

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
          <div className={styles.scoreValue}>{withCommas(userScore)}</div>
        </div>
        {/* ------ USER BOXES ------ */}
        <div className={styles.scoreRow}>
          <div className={styles.scoreLabel}>Boxes</div>
          <div className={styles.scoreValue}>{userBoxes}</div>
        </div>
      </div>
      <button className={styles.button} onClick={() => signOut()}>Logout</button>
    </div>
  );
};

export default Profile;
