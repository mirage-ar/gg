"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import styles from "./page.module.css";
import { usePrivy } from "@privy-io/react-auth";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const { logout } = usePrivy();

  let errorMessage = "An unknown error occurred";
  if (error === "UserNotWhitelisted") {
    errorMessage = "Authentication failed: You are not whitelisted to play.";
  }

  useEffect(() => {
    if (error) {
      logout();
      setTimeout(() => {
        // TODO: update to spectate page
        window.location.href = "https://gg.zip/";
      }, 1000);
    }
  }, [error, logout]);

  return (
    <main className={styles.container}>
      <div className={styles.logo}>{errorMessage}</div>
      {/* <button className={styles.button} onClick={() => handleSignIn()}>
        Sign in
      </button> */}
    </main>
  );
};

export default ErrorPage;
