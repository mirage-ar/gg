"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleSignIn = () => {
    signIn("twitter", { callbackUrl: "/" });
  }

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
    <div>
      <button onClick={() => handleSignIn()}>Sign in</button>
    </div>
  );
};

export default LoginPage;
