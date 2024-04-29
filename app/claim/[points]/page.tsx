"use client";

import React from "react";
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

  const [tapped, setTapped] = React.useState(false);

  const handleTap = () => {
    if (tapped) {
      router.push("/");
    }
    setTapped(true);
  };

  return (
    <main className={styles.container}>
      <div className={styles.background}>
        <TopBar />
        {tapped && <div className={styles.pointsContainer}>+ {formattedPoints}</div>}
        <div className={styles.modelContainer} onClick={handleTap}>
          <div style={{ height: "400px", width: "100%", overflow: "hidden" }}>
            <ModelViewer name={tapped ? "koji-open" : "koji-closed"} />
          </div>
          {!tapped && <p>Tap to Open!</p>}
        </div>
        {/* <button className={styles.button} onClick={handleTap}>
          Tap to Claim
        </button> */}
      </div>
    </main>
  );
};

export default ClaimPage;
