"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { usePrivy } from "@privy-io/react-auth";
import MapboxMap from "@/components/map/MapboxMap";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log("leaderboard page");
  });
  return (
    <main>
      <h1>Leaderboard</h1>
    </main>
  );
}
