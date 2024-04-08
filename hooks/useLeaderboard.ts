import { useState, useEffect } from "react";

import { LeaderboardItem } from "@/types";
import { API } from "@/utils/constants";

export default function useLeaderboard(id: string | undefined) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userScore, setUserScore] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${API}/leaderboard/${id}`);
        const data = await response.json();
        setLeaderboard(data.leaderboard);
        setUserRank(data.userRank);
        setUserScore(data.userScore);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();

    const intervalId = setInterval(fetchLeaderboard, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [id]);
  return {
    leaderboard,
    userRank,
    userScore
  };
}
