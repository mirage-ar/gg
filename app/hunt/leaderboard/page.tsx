"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { usePrivy } from "@privy-io/react-auth";
import MapboxMap from "@/components/map/MapboxMap";
import { useEffect } from "react";
import Leaderboard from "@/components/leaderboard/Leaderboard";

export default function Home() {
  useEffect(() => {
    console.log("leaderboard page");
  });
  return (
    <main>
      <Leaderboard />
    </main>
  );
}
