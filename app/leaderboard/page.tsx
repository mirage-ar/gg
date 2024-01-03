"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Leaderboard from "@/components/leaderboard/Leaderboard";

import styles from "./page.module.css";
import { User } from "@/types";

const LeaderboardPage: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as User;
  
  return (
    <main className={styles.container}>
      <button className={styles.header} onClick={() => router.push('/')}>
        <Image src="/icons/icons-24/arrow-b.svg" alt="Back Button" width={24} height={24} />
      </button>
      <Leaderboard />
    </main>
  );
};

export default LeaderboardPage;
