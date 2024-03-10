"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

import styles from "./page.module.css";
import { access } from "fs";

const LoginPage = () => {
  const [accessCode, setAccessCode] = useState("");

  const handleSignIn = async () => {
    // Check the access code in the database
    const isValidCode = await checkAccessCode(accessCode);

    if (isValidCode) {
      signIn("twitter", { callbackUrl: "/" });
    } else {
      alert("Invalid access code");
    }
  };

  const checkAccessCode = async (code: string) => {
    const response = await fetch(`/api/codes/${code}`);
    const data = await response.json();

    console.log(data);
    return data.authorized;
  };

  return (
    <main className={styles.container}>
      <div className={styles.logo} onClick={() => handleSignIn()}>
        {/* <Image src="/icons/logo.svg" alt="logo" width={100} height={100} /> */}
        CONNECT VIA X
      </div>
      <input
        type="text"
        value={accessCode}
        onChange={(e) => setAccessCode(e.target.value)}
        placeholder="Enter access code"
        className={styles.input}
      />
      <button className={styles.button} onClick={() => handleSignIn()}>
        Sign in
      </button>
    </main>
  );
};

export default LoginPage;
