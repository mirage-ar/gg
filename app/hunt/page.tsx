"use client";

import React, { useState, useEffect } from "react";
import MapChat from "@/components/chat/MapChat";

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
      <MapChat />
    </main>
  );
};

export default MapPage;
