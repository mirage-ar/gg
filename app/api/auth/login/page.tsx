"use client";

import React from "react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import styles from "./page.module.css";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleSignIn = () => {
    signIn("twitter", { callbackUrl: "/" });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (session) {
    return (
      <>
        <p>Signed in as {session?.user?.name}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.logo}>
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
