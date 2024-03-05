import { ScoreData } from "@/types";
import { useState, useEffect } from "react";

export default function useScore(username?: string) {
  const [score, setScore] = useState<number>(0);
  const [boxes, setBoxes] = useState<number>(0);

  useEffect(() => {
    if (!username) return;
    const fetchPointData = async () => {
      try {
        const response = await fetch(`/api/score/${username}`);
        const userScore: ScoreData = await response.json();
        const userPoints = userScore?.points ?? 0;
        const userBoxes = userScore?.boxes ?? 0;
        setScore(userPoints);
        setBoxes(userBoxes);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    fetchPointData();
  }, [username]);

  return {
    score,
    boxes,
  };
}
