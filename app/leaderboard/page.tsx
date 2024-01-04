"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PageHeader from "@/components/navigation/PageHeader";
import Leaderboard from "@/components/leaderboard/Leaderboard";

import styles from "./page.module.css";
import { User } from "@/types";

const LeaderboardPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <main className={styles.container}>
      <PageHeader />
      <Leaderboard />
    </main>
  );
};

export default LeaderboardPage;
