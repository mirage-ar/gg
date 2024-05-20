import { ScoreData } from "@/types";
import { GAME_API } from "@/utils/constants";
import { useState, useEffect } from "react";

export default function useScore(id?: string) {
  const [score, setScore] = useState<number>(0);
  const [boxes, setBoxes] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    const fetchPointData = async () => {
      try {
        const response = await fetch(`${GAME_API}/score/${id}`);
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
  }, [id]);

  return {
    score,
    boxes,
  };
}
