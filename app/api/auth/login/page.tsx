"use client";

import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";

const LoginPage = () => {
  const { authenticated, login, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    const checkWhitelist = async (username: string) => {
      const response = await fetch(`/api/whitelist/${username}`);
      const data = await response.json();
      if (data.userExists) {
        router.push("/");
      } else {
        router.push("/api/auth/error?error=UserNotWhitelisted");
      }
    };

    if (authenticated && user?.twitter?.username) {
      const username = user?.twitter?.username;
      checkWhitelist(username);
    }
  }, [authenticated, user, router]);

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
