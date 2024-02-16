import { useState, useEffect } from "react";

import { LeaderboardItem } from "@/types";

export default function useLeaderboard(userId: string | undefined) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard/${userId}`);
        const data = await response.json();
        console.log(data);
        setLeaderboard(data.leaderboard);
        setUserRank(data.userRank);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();

    const intervalId = setInterval(fetchLeaderboard, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId]);
  return {
    leaderboard,
    userRank,
  };
}
