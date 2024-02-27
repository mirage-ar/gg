"use client";

import React from "react";
import PageHeader from "@/components/navigation/PageHeader";
import Leaderboard from "@/components/leaderboard/Leaderboard";

import styles from "./page.module.css";

const LeaderboardPage: React.FC = () => {

  return (
    <main className={styles.container}>
      <PageHeader />
      <Leaderboard />
    </main>
  );
};

export default LeaderboardPage;
