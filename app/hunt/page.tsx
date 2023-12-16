"use client";

import React, { useState, useEffect } from "react";
import Chat from "@/components/chat/Chat";

import type { User } from "@/types";

const MapPage: React.FC = () => {
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
};

export default MapPage;
