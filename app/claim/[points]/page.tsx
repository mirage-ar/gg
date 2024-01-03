"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/navigation/TopBar";

import styles from "./page.module.css";

const ClaimPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { points } = params;

  return (
    <main className={styles.container}>
      <TopBar />
      <div className={styles.content}>
        <h1>Claim Page</h1>
        <p>Claimed {points} points</p>
      </div>
      <button className={styles.button} onClick={() => router.push(`/`)}>
        Continue
      </button>
    </main>
  );
};

export default ClaimPage;
