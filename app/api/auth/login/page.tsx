"use client";

import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";

const LoginPage = () => {
  const { ready, authenticated, login } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  return (
    <main className={styles.container}>
      <div className={styles.logo}>
        {/* <Image src="/icons/logo.svg" alt="logo" width={100} height={100} /> */}
        CONNECT VIA X
      </div>
      <button className={styles.button} onClick={() => login()}>
        Sign in
      </button>
    </main>
  );
};

export default LoginPage;
