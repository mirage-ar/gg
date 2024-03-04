"use client";

import React from "react";
import { signIn } from "next-auth/react";

import styles from "./page.module.css";

const LoginPage = () => {
  const handleSignIn = () => {
    signIn("twitter", { callbackUrl: "/" });
  };

  return (
    <main className={styles.container}>
      <div className={styles.logo} onClick={() => handleSignIn()}>
        {/* <Image src="/icons/logo.svg" alt="logo" width={100} height={100} /> */}
        CONNECT VIA X
      </div>
      <button className={styles.button} onClick={() => handleSignIn()}>
        Sign in
      </button>
    </main>
  );
};

export default LoginPage;
