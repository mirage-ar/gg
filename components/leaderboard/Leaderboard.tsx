// components/Leaderboard.tsx
"use client";

import React, { useEffect, useState } from "react";

import { GET_POINTS_URL } from "@/utils";

interface LeaderboardItem {
  id: number;
  username: string;
  walletAddress: number;
  points: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(GET_POINTS_URL);
        const data: LeaderboardItem[] = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();

    const intervalId = setInterval(fetchLeaderboard, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <ul>
        {leaderboard
          .sort((a, b) => b.points - a.points) // Sorts in descending order of points
          .map((player) => (
            <div key={player.id}>
              {player.points > 0 && (
                <li>
                  {player.username} - {player.points}
                </li>
              )}
            </div>
          ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
