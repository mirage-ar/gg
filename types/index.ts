export type User = {
  id?: string;
  image: string;
  twitterId: string;
  username: string;
  points?: number;
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

export type ScoreData = {
  points: number;
  boxes: number;
};

export type ChatMessage = {
  message: string;
  timestamp: number;
  username: string;
  image: string;
};

export type LeaderboardItem = {
  id: number;
  username: string;
  image: string;
  wallet: number;
  points: number;
};

export type GameDate = {
  year: number;
  month: number;
  day: number;
};