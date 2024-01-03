export type User = {
  id: string;
  image: string;
  name: string;
  username: string;
};

export type LocationData = {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  timestamp: number;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type MarkerData = {
  id: string;
  latitude: number;
  longitude: number;
};

export type BoxData = {
  id: string;
  latitude: number;
  longitude: number;
  points: number;
  collected: boolean;
  username: string;
  pfp: string;
};

export type UsersData = {
  id: string;
  username: string;
  pfp: string;
  points: number;
  boxes: number;
};

export type ChatMessage = {
  message: string;
  timestamp: number;
  username: string;
  pfp: string;
};
