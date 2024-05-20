import { useState, useEffect } from "react";

import { LeaderboardItem } from "@/types";
import { GAME_API, POLLING_TIME } from "@/utils/constants";

export default function useLeaderboard(id: string | undefined) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [userBoxes, setUserBoxes] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${GAME_API}/leaderboard/${id}`);
        const data = await response.json();
        setLeaderboard(data.leaderboard);
        setUserRank(data.userRank);
        setUserScore(data.userScore);
        setUserBoxes(data.userBoxes);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchLeaderboard();
      }
    }, POLLING_TIME);

    return () => {
      clearInterval(interval);
    };
  }, [id]);
  return {
    leaderboard,
    userRank,
    userScore,
    userBoxes,
  };
}
