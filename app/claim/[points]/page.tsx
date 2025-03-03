"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/navigation/TopBar";

import styles from "./page.module.css";
import { withCommas } from "@/utils";

const ModelViewer = dynamic(() => import("@/components/model/ModelViewer"), {
  ssr: false,
});

const ClaimPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { points } = params;
  const formattedPoints = withCommas(parseInt(points as string));

  const [tapped, setTapped] = useState(false);

  const level = Number(points);
  let color;

  if (level > 5000) {
    color = "#FF0000";
  } else if (level > 1000) {
    color = "#F5E900";
  } else if (level > 500) {
    color = "#0082F2";
  } else if (level > 100) {
    color = "#E557F0";
  } else {
    color = "#00F0F4";
  }

  const handleTap = () => {
    if (tapped) {
      router.push("/");
    }
    setTapped(true);
  };

  return (
    <main className={styles.container}>
      <div className={styles.background} onClick={handleTap}>
        <TopBar />
        {tapped && <div className={styles.pointsContainer}>+ {formattedPoints}</div>}
        <div className={styles.modelContainer}>
          <div style={{ height: "400px", width: "100%", overflow: "hidden" }}>
            <ModelViewer name={tapped ? "koji-open" : "koji-closed"} color={color} />
          </div>
          <p className={`${!tapped ? styles.glow : ""}`}>Tap to {tapped ? "Close" : "Open!"}</p>
        </div>
        {/* <button className={styles.button} onClick={handleTap}>
          Tap to Claim
        </button> */}
      </div>
    </main>
  );
};

export default ClaimPage;
