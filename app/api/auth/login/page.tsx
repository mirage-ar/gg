"use client";

import React, { useEffect } from "react";
import { User, usePrivy } from "@privy-io/react-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./page.module.css";

const LoginPage = () => {
  const { authenticated, login, user } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    const checkWhitelist = async (user: User) => {
      const username = user?.twitter?.username;
      const response = await fetch(`/api/whitelist/${username}`);
      const data = await response.json();
      
      if (data.userExists) {
        // create user in db
        const response = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user }),
        });
        router.push("/");
      } else {
        router.push("/api/auth/error?error=UserNotWhitelisted");
      }
    };

    // Make sure user is authenticated and is on whitelist
    if (authenticated && user?.twitter?.username) {
      checkWhitelist(user);
    }
  }, [authenticated, user, router]);

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
