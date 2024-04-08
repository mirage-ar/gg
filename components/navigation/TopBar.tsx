"use client";

import React from "react";
import Image from "next/image";
import { useUser, useScore } from "@/hooks";
import { withCommas } from "@/utils";
import styles from "./TopBar.module.css";

const TopBar: React.FC = () => {
  const user = useUser();
  const { score, boxes } = useScore(user?.id);

  return (
    <div className={styles.container}>
      {/* <div className={styles.prizeContainer}>
        <div className={styles.title}>Prize Pool</div>
        <div className={styles.prizeAmountContainer}>
          <div className={styles.prizeAmount}>{withCommas(150)}</div>
          <Image alt="Solana Icon" src="/icons/solana.svg" width={16} height={16} />
        </div>
      </div> */}
      <div className={styles.scoreContainer}>
        <div className={styles.title}>My Score</div>
        <div className={styles.scoreAmountContainer}>
          <div className={styles.scoreAmount}>{withCommas(score)}</div>
          <Image alt="G Icon" src="/icons/16/g-points.svg" width={16} height={16} />
          <div className={styles.boxAmountContainer}>
            <div className={styles.boxAmount}><span className={styles.grey}>(</span>{boxes}<span className={styles.grey}>)</span></div>
            <Image alt="Box Icon" src="/icons/16/box-closed.svg" width={16} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
