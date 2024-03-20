"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import HomeScreenOverlay from "@/components/onboarding/HomeScreenOverlay";

const LoginPage = () => {
  const router = useRouter();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isAndroid = /(android)/i.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone || isAndroid;
    setIsStandalone(true);
  }, [router]);

  const handleSignIn = async () => {
    signIn("twitter", { callbackUrl: "/" });
  };

  if (!isStandalone) {
    return (
      <main>
        <HomeScreenOverlay />
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.logo}>
        <Image src="/icons/logo.svg" alt="Logo" width={176} height={176} />
      </div>
      <div className={styles.hunter} onClick={() => handleSignIn()}>
        <Image src="/graphics/hunter-onboarding.svg" alt="Logo" width={367} height={528} />
      </div>
      <h1 className={styles.title}>Start Global<br />Hunt</h1>
      <button className={styles.button} onClick={() => handleSignIn()}>
        Sign in
      </button>
    </main>
  );
};

export default LoginPage;
