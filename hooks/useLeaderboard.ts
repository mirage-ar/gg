import { useState, useEffect } from "react";

import { LeaderboardItem } from "@/types";
import { GAME_API, POLLING_TIME } from "@/utils/constants";

export default function useLeaderboard(id: string | undefined) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userRank, setUserRank] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [userBoxes, setUserBoxes] = useState<number>(0);

  // useEffect(() => {
  //   if (!id) return;
  //   const fetchLeaderboard = async () => {
  //     try {
  //       const response = await fetch(`${GAME_API}/leaderboard/${id}`);
  //       const data = await response.json();
  //       setLeaderboard(data.leaderboard);
  //       setUserRank(data.userRank);
  //       setUserScore(data.userScore);
  //       setUserBoxes(data.userBoxes);
  //     } catch (error) {
  //       console.error("Error fetching leaderboard:", error);
  //     }
  //   };

  //   fetchLeaderboard();

  //   const interval = setInterval(() => {
  //     if (document.visibilityState === "visible") {
  //       fetchLeaderboard();
  //     }
  //   }, POLLING_TIME);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [id]);

  useEffect(() => {
    setLeaderboard([
      {
        id: 123,
        username: "fiigmnt",
        image: "https://pbs.twimg.com/profile_images/1564446865927593984/2dKVOZk7_400x400.jpg",
        wallet: 123,
        points: 30000,
        boxes: 30,
      },
    ]);

    setUserRank(1);
    setUserBoxes(30);
    setUserScore(30000);
  }, []);

  return {
    leaderboard,
    userRank,
    userScore,
    userBoxes,
  };
}
