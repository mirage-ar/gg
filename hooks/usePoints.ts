import { PointstData } from "@/types";
import { useState, useEffect } from "react";

export default function useUser(userId?: string) {
  const [points, setPoints] = useState<number>(0);
  const [boxes, setBoxes] = useState<number>(0);

  useEffect(() => {
    if (!userId) return;
    const fetchPointData = async () => {
      try {
        const response = await fetch(`api/points/${userId}`);
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
  }, [userId]);

  return {
    points,
    boxes,
  };
}
