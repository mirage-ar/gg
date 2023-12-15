"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import { usePrivy } from "@privy-io/react-auth";

function LoginButton() {
  const { login } = usePrivy();
  return <button onClick={login}>Log in</button>;
}

function LogoutButton() {
    const { logout } = usePrivy();
    return <button onClick={logout}>Log out</button>;
  }

export default function Home() {
  const { user } = usePrivy();

  useEffect(() => {
    if (user) {
      console.log("user exists");

      // redirect("/");
    }
  }, [user]);

  return (
    <main>
      <h1>Login</h1>
      <div>{!user && <LoginButton />}</div>
      <div>{user && <LogoutButton />}</div>
    </main>
  );
}
