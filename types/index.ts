export type User = {
  id: string;
  image: string;
  twitterId: string;
  username: string;
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

export type PointstData = {
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
