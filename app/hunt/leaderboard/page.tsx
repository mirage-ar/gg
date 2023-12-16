"use client";

import React, { useEffect } from "react";
import Leaderboard from "@/components/leaderboard/Leaderboard";

const LeaderboardPage: React.FC = () => {
  useEffect(() => {
    console.log("leaderboard page");
  });
  return (
    <main>
      <Leaderboard />
    </main>
  );
};

export default LeaderboardPage;
