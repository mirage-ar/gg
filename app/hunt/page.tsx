"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import MapboxMap from "@/components/map/MapboxMap";
import { User } from "@/types";
import Chat from "@/components/chat/Chat";

export default function Home() {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      setUserData(JSON.parse(userFromStorage));
    }
  }, []);

  return (
    <main>
      <Chat />
    </main>
  );
}
