"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";

import styles from "./page.module.css";
import { access } from "fs";
import { useRouter } from "next/navigation";
import HomeScreenOverlay from "@/components/onboarding/HomeScreenOverlay";

const LoginPage = () => {
  const router = useRouter();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isAndroid = /(android)/i.test(navigator.userAgent);
    const isStandalone = (window.navigator as any).standalone || isAndroid;
    setIsStandalone(isStandalone);
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
      <div className={styles.logo} onClick={() => handleSignIn()}>
        CONNECT VIA X
      </div>
      <button className={styles.button} onClick={() => handleSignIn()}>
        Sign in
      </button>
    </main>
  );
};

export default LoginPage;
