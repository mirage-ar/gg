import React from "react";
import Image from "next/image";

import styles from "./HomeScreenOverlay.module.css";

const HomeScreenOverlay: React.FC = () => {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <Image alt="logo" src="/icons/logo.svg" width={200} height={200} />
        <div className={styles.text}>
          Add
          <br />
          to Home
          <br />
          Screen
        </div>
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.bottomText}>
          In Safari, tap &apos;Share&apos;, then choose &apos;Add to Home Screen&apos;. Open the GG app from your home screen
        </div>
        <Image alt="arrow" src="/icons/long-arrow.svg" width={24} height={24} />
      </div>
    </main>
  );
};

export default HomeScreenOverlay;
