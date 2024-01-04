"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import type { User, UsersData, LeaderboardItem } from "@/types";
import { GET_POINTS_URL } from "@/utils/constants";

import styles from "./Profile.module.css";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const session = await getSession();
      setUser(session?.user as User);
    };
    getUser();
  }, []);

  const [score, setScore] = useState<number>(0);
  const [boxes, setBoxes] = useState<number>(0);

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.points - a.points);
  const userRank = sortedLeaderboard.findIndex((player) => player.id.toString() === user?.id) + 1;

  useEffect(() => {
    if (!user?.id) return;

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(GET_POINTS_URL);
        const data: LeaderboardItem[] = await response.json();
        setLeaderboard(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    const fetchScore = async (userId: string) => {
      console.log(`fetching score for ${userId}`);
      try {
        const response = await fetch(`${GET_POINTS_URL}?userId=${userId}`);
        const userPointsData: UsersData[] = await response.json();
        const userPoints = userPointsData[0]?.points ?? 0;
        const userBoxes = userPointsData[0]?.boxes ?? 0;
        setScore(userPoints);
        setBoxes(userBoxes);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    fetchScore(user?.id);
    fetchLeaderboard();
  }, [user]);

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
            {userRank}/{sortedLeaderboard.length}
          </div>
        </div>
        {/* ------ USER SCORE ------ */}
        <div className={styles.scoreRow}>
          <div className={styles.scoreLabel}>Score</div>
          <div className={styles.scoreValue}>{score}</div>
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
