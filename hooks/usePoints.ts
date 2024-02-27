import { PointstData } from "@/types";
import { useState, useEffect } from "react";

export default function usePoints(twitterId?: string) {
  const [points, setPoints] = useState<number>(0);
  const [boxes, setBoxes] = useState<number>(0);

  useEffect(() => {
    if (!twitterId) return;
    const fetchPointData = async () => {
      try {
        const response = await fetch(`api/points/${twitterId}`);
        const userPointsData: PointstData = await response.json();
        const userPoints = userPointsData?.points ?? 0;
        const userBoxes = userPointsData?.boxes ?? 0;
        setPoints(userPoints);
        setBoxes(userBoxes);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    fetchPointData();
  }, [twitterId]);

  return {
    points,
    boxes,
  };
}
