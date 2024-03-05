"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/navigation/TopBar";

import styles from "./page.module.css";
import { useUser } from "@/hooks";
import { withCommas } from "@/utils";

const ModelViewer = dynamic(() => import("@/components/model/ModelViewer"), {
  ssr: false,
});

const ClaimPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { points } = params;
  const formattedPoints = withCommas(parseInt(points as string));

  return (
    <main className={styles.container}>
      <div className={styles.background}>
      <TopBar />
      <div className={styles.pointsContainer}>+ {formattedPoints}</div>
      <div className={styles.modelContainer} onClick={() => router.push("/")}>
        <ModelViewer name={"koji"} />
      </div>
      <button className={styles.button} onClick={() => router.push(`/`)}>
        Tap to Claim
      </button>
      </div>
    </main>
  );
};

export default ClaimPage;
