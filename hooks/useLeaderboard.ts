import { useState, useEffect } from "react";

import { LeaderboardItem } from "@/types";

export default function useLeaderboard(username: string | undefined) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userScore, setUserScore] = useState<number | null>(null);

  useEffect(() => {
    if (!username) return;
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard/${username}`);
        const data = await response.json();
        console.log(data);
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
  }, [username]);
  return {
    leaderboard,
    userRank,
    userScore
  };
}
