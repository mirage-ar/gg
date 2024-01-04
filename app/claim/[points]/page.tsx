"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import TopBar from "@/components/navigation/TopBar";

import styles from "./page.module.css";
import { User } from "@/types";

const ClaimPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const session = await getSession();
      setUser(session?.user as User);
    };
    getUser();
  }, []);

  const params = useParams();
  const router = useRouter();
  const { points } = params;

  return (
    <main className={styles.container}>
      <TopBar />
      <div className={styles.content}>
        <div className={styles.userMarker}>
          <Image className={styles.userImage} src={user?.image || ""} alt="User Image" width={150} height={150} />
        </div>
        <p>Claimed {points} points</p>
      </div>
      <button className={styles.button} onClick={() => router.push(`/`)}>
        Continue
      </button>
    </main>
  );
};

export default ClaimPage;
