"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getSession } from "next-auth/react";
import type { User, UsersData } from "@/types";

import { GET_POINTS_URL } from "@/utils/constants";

import styles from "./TopBar.module.css";

interface TopBarProps {
  score?: number;
  boxes?: number;
}

const TopBar: React.FC<TopBarProps> = ({ score: scoreInput = 0, boxes: boxesInput = 0 }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const session = await getSession();
      setUser(session?.user as User);
    };
    getUser();
  }, []);

  const [score, setScore] = useState<number>(scoreInput);
  const [boxes, setBoxes] = useState<number>(boxesInput);


  useEffect(() => {
    if (!user?.id) return;

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
  }, [user]);

  return (
    <div className={styles.container}>
      <div className={styles.prizeContainer}>
        <div className={styles.title}>Prize Pool</div>
        <div className={styles.prizeAmountContainer}>
          <div className={styles.prizeAmount}>{25000}</div>
          <Image alt="Solana Icon" src="/icons/solana.svg" width={16} height={16} />
        </div>
      </div>
      <div className={styles.scoreContainer}>
        <div className={styles.title}>My Score</div>
        <div className={styles.scoreAmountContainer}>
          <div className={styles.scoreAmount}>{score}</div>
          <Image alt="G Icon" src="/icons/g-points.svg" width={16} height={16} />
          <div className={styles.boxAmountContainer}>
            <div className={styles.boxAmount}>({boxes})</div>
            <Image alt="Box Icon" src="/icons/box-closed.svg" width={16} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
