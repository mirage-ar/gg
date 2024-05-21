"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import styles from "./page.module.css";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error === "NO PRISMA USER") {
    return (
      <div className={styles.container}>
        <div className={styles.logo}>You have not minted your player card - please visit: gg.zip/mint</div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.logo}>{error}</div>
    </main>
  );
};

export default ErrorPage;
