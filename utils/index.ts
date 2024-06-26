// UTILS

import { GameDate } from "@/types";
import { GAME_TIME } from "./constants";
import { formatDistanceToNow } from 'date-fns';

/* Calculate distance between two points in meters */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const rand = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const withCommas = (x: number | string): string => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function getGameStartTime({ year, month, day }: GameDate) {
  const zeroIndexMonth = month - 1;
  const easternTime = new Date(Date.UTC(year, zeroIndexMonth, day, GAME_TIME + 4, 0, 0));

  return easternTime.getTime();
}

export function formatDate(date: Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
    .replace("about ", "")
    .replace("less than a minute ago", "now")
    .replace(" ", "")
    .replace("minutes", "m")
    .replace("minute", "m")
    .replace("hours", "h")
    .replace("hour", "h")
    .replace("days", "d")
    .replace("day", "d")
    .replace("months", "mo")
    .replace("month", "mo")
    .replace("years", "y")
    .replace("year", "y");
}