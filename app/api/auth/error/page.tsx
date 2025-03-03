"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import styles from "./page.module.css";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  if (error === "BLACKLISTED") {
    return (
      <div className={styles.container}>
        <div className={styles.background} />
        <div className={styles.errorContainer}>
          <Image src="/icons/icons-24/error-box.svg" alt="Logo" width={96} height={96} />
          <div className={`${styles.subline} ${styles.error}`}>You’ve been blacklisted</div>
        </div>
      </div>
    );
  }

  if (error === "NO PRISMA USER") {
    return (
      <div className={styles.container}>
        <Image src="/graphics/card.svg" alt="Logo" width={241} height={303} />
        <div className={styles.subline}>
          To start, mint your
          <br />
          player card on
          <br />
          desktop via:
        </div>
        <Image src="/icons/icons-24/card.svg" alt="Logo" width={24} height={24} />
        <div className={styles.subline} style={{ color: "#FF61EF" }}>
          GG.ZIP
        </div>
        <Link href="/">
          <div className={styles.link}>Back to Login</div>
        </Link>
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
