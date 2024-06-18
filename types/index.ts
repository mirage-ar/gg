export type User = {
  id: string;
  image: string;
  username: string;
  wallet: string;
};

export type LocationData = {
  id: string;
  image: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  timestamp: number;
};

export type ChatMessage = {
  message: string;
  timestamp: number;
  username: string;
  image: string;
  source: string;
};

export type LeaderboardItem = {
  id: number;
  username: string;
  image: string;
  wallet: number;
  points: number;
  boxes: number
};

export type GameDate = {
  year: number;
  month: number;
  day: number;
};