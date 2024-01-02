"use client";

import React, { useState, useEffect } from "react";
import MapChat from "@/components/chat/MapChat";

import type { User } from "@/types";

const MapPage: React.FC = () => {

  return (
    <main>
      <MapChat />
    </main>
  );
};

export default MapPage;
