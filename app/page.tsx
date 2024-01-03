"use client";

import React, { useState, useEffect } from "react";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import MapChat from "@/components/chat/MapChat";
import TopBar from "@/components/navigation/TopBar";

import type { User } from "@/types";

const MapPage: React.FC = () => {

  return (
    <main>
      <MapChat />
      <TopBar />
      <BottomNavigation />
    </main>
  );
};

export default MapPage;
