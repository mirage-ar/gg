"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import styles from "./page.module.css";

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An unknown error occurred";
  if (error === "UserNotWhitelisted") {
    errorMessage = "Authentication failed: You are not whitelisted to play.";
  }

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
