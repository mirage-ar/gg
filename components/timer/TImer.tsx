import React from "react";
import styles from "./Timer.module.css";

interface TimerProps {
  timeRemaining: number;
}

const Timer: React.FC<TimerProps> = ({ timeRemaining }) => {

  const lessThanDay = timeRemaining < 86400000; // 24 hours in milliseconds

  // Format the time remaining
  const formatTime = (time: number): string => {
    if (time <= 0) {
      return `${ lessThanDay ? "" : "00:"}00:00:00`; // Added days to the format
    }
    const days = Math.floor(time / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(2, "0");
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((time / 1000) % 60)
      .toString()
      .padStart(2, "0");

    return `${ lessThanDay ? "" : days + ":"}${hours}:${minutes}:${seconds}`; // Now includes days
  };

  return <div className={styles.main}>{formatTime(timeRemaining)}</div>;
};

export default Timer;
