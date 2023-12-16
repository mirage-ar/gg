"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { usePrivy } from "@privy-io/react-auth";
import MapboxMap from "@/components/map/MapboxMap";
import { useEffect } from "react";

function LogoutButton() {
  const { logout } = usePrivy();
  return <button onClick={logout}>Log Out</button>;
}

function LoginButton() {
    const { login } = usePrivy();
    return <button onClick={login}>Log In</button>;
  }

export default function Home() {
  const { user } = usePrivy();
  useEffect(() => {
    console.log("chat page");
  });
  return (
    <main>
      <h1>Chat</h1>
      {!user && <LoginButton />}
      {user && <LogoutButton />}
    </main>
  );
}
