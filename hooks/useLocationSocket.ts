import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { LOCATION_SOCKET_URL, GAME_DATE, GAME_LENGTH } from "@/utils/constants";
import { getGameStartTime } from "@/utils";
import type { LocationData, User } from "@/types";

type FetchAndUpdateBoxes = (latitude: number, longitude: number) => Promise<void>;

const useLocationSocket = (
  user: User | null,
  mapRef: React.RefObject<mapboxgl.Map | null>,
  fetchAndUpdateBoxes: FetchAndUpdateBoxes
) => {
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const markersSocket = useRef<WebSocket | null>(null);
  const markersRef = useRef({});
  const userIdRef = useRef<string | null>(null);
  const mapCenteredRef = useRef(false);

  const calculateTimeRemaining = () => {
    const currentTime = new Date().getTime();
    const gameTime = getGameStartTime(GAME_DATE) + GAME_LENGTH;
    return gameTime - currentTime;
  };

  useEffect(() => {
    if (!user?.id || !mapRef) return;
    userIdRef.current = user.id;

    let watchId: number;

    const connectWebSocket = () => {
      markersSocket.current = new WebSocket(LOCATION_SOCKET_URL);

      markersSocket.current.onopen = () => {
        console.log("WebSocket Connected");

        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            setCurrentLocation(position);
            const hasOnboarded = localStorage.getItem("hasOnboarded") === "true";

            // CENTER MAP ON USER IF FIRST TIME
            if (!mapCenteredRef.current && mapRef.current && hasOnboarded) {
              const map = mapRef.current!;

              map.setCenter([position.coords.longitude, position.coords.latitude]);
              map.flyTo({
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 18,
                pitch: 15,
                essential: true,
              });
              mapCenteredRef.current = true;
            }

            if (hasOnboarded || calculateTimeRemaining() > 0) {
              fetchAndUpdateBoxes(position.coords.latitude, position.coords.longitude);
            }

            if (markersSocket.current && markersSocket.current.readyState === WebSocket.OPEN && user?.id) {
              const location = {
                id: user.id,
                image: user.image,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                timestamp: position.timestamp,
              };
              markersSocket.current.send(JSON.stringify({ action: "sendmessage", data: location }));
            }
          },
          (error) => {
            console.error("Error getting location", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
          }
        );
      };

      markersSocket.current.onmessage = (event) => {
        const message: LocationData = JSON.parse(event.data);
        const map = mapRef.current;
        if (map) updateMarkers(map, message);
      };

      markersSocket.current.onerror = (error) => {
        console.error("WebSocket Error", error);
      };

      markersSocket.current.onclose = () => {
        console.log("WebSocket Disconnected, attempting to reconnect...");
        navigator.geolocation.clearWatch(watchId);
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      markersSocket.current?.close();
      navigator.geolocation.clearWatch(watchId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateMarkers = (map: mapboxgl.Map, message: LocationData) => {
    if (map && message.id && message.latitude && message.longitude) {
        // @ts-ignore
        const existingMarker = markersRef.current[message.id];
        if (existingMarker) {
            existingMarker.setLngLat([message.longitude, message.latitude]);
        } else {
            const div = document.createElement("div");
            const img = document.createElement("img");
            div.className = message.id === user?.id ? "user-marker" : "opponent-marker";
            img.src = message.image;
            div.appendChild(img);

            const newMarker = new mapboxgl.Marker(div).setLngLat([message.longitude, message.latitude]).addTo(map);
            // @ts-ignore
            markersRef.current[message.id] = newMarker;
        }
    }
  };

  return { currentLocation, markersRef };
};

export default useLocationSocket;
