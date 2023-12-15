export const LOCATION_SOCKET_URL =
  "wss://qbsgkbx2gi.execute-api.us-east-1.amazonaws.com/dev";
export const CHAT_SOCKET_URL =
  "wss://gbp22vx8yh.execute-api.us-east-1.amazonaws.com/dev";

export const GET_MESSAGES_URL =
  "https://s7f5ctoh93.execute-api.us-east-1.amazonaws.com";
export const GET_POINTS_URL =
  "https://hh68ceujdc.execute-api.us-east-1.amazonaws.com";
export const GET_BOXES_URL =
  "https://c17isg4f2b.execute-api.us-east-1.amazonaws.com";

export const COLLECT_BOX_URL =
  "https://cgt2ejkk93.execute-api.us-east-1.amazonaws.com/collect";

// TODO: update this to a constants file

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};
