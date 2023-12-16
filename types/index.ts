export type User = {
  id: string;
  username: string;
  wallet: string;
  pfp: string;
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
  collected: boolean;
};

export type ChatMessage = {
  message: string;
  name: string;
  imageUrl: string;
};
