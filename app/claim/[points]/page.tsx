"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/navigation/TopBar";

import styles from "./page.module.css";
import { useUser } from "@/hooks";

const ModelViewer = dynamic(() => import("@/components/model/ModelViewer"), {
  ssr: false,
});

const ClaimPage: React.FC = () => {
  const user = useUser();

  const params = useParams();
  const router = useRouter();
  const { points } = params;

  return (
    <main className={styles.container}>
      <TopBar />
      <div className={styles.modelContainer}>
        <ModelViewer name={"horse"} />
      </div>
      <button className={styles.button} onClick={() => router.push(`/`)}>
        Continue
      </button>
    </main>
  );
};

export default ClaimPage;
