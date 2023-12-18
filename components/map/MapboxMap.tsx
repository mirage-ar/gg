"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { calculateDistance } from "@/utils";
import "mapbox-gl/dist/mapbox-gl.css";

import type { MarkerData, BoxData, User } from "@/types";
import { LOCATION_SOCKET_URL, GET_BOXES_URL, COLLECT_BOX_URL } from "@/utils/constants";
// import router from "next/router";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

type MarkersObject = {
  [id: string]: mapboxgl.Marker;
};

const MapboxMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersSocket = useRef<WebSocket | null>(null);
  const markersRef = useRef<MarkersObject>({});
  const boxesRef = useRef<MarkersObject>({});
  const [boxes, setBoxes] = useState<BoxData[]>([]);
  const [boxCollect, setBoxCollect] = useState<BoxData | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const [showCollectButton, setShowCollectButton] = useState(false);

  // SETUP MAP
  useEffect(() => {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null;
    if (!user) {
      // router.push("/auth/login");
      console.error("User not found");
    }
    setUser(user);

    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      // TODO: update to NYC or user location
      center: [-71.07, 42.35],
      zoom: 10,
      pitch: 45,
    });

    map.on("style.load", () => {
      // @ts-ignore
      map.setConfigProperty("basemap", "lightPreset", "night");
      // @ts-ignore
      map.setConfigProperty("basemap", "showPointOfInterestLabels", false);
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Markers Socket
  useEffect(() => {
    markersSocket.current = new WebSocket(LOCATION_SOCKET_URL);

    let watchId: number;

    markersSocket.current.onopen = () => {
      console.log("WebSocket Connected");
      // location tracking
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log("position", position);
          // TODO: if user is within box location radius, redirect to collect page
          checkProximityToBoxes(position.coords.latitude, position.coords.longitude);

          if (markersSocket.current && markersSocket.current.readyState === WebSocket.OPEN && user?.id) {
            sendCurrentLocation(position, user.id, markersSocket.current);
          }
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    };

    markersSocket.current.onmessage = (event: MessageEvent) => {
      const message: MarkerData = JSON.parse(event.data);
      const map = mapRef.current;
      if (map) updateMarkers(map, message);
    };

    markersSocket.current.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      markersSocket.current?.close();
      navigator.geolocation.clearWatch(watchId);
    };
  }, [user]);

  // Fetch Boxes
  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await fetch(GET_BOXES_URL);
        const boxesData: BoxData[] = await response.json();
        const map = mapRef.current;
        setBoxes(boxesData);
        if (map) {
          boxesData.forEach((box) => updateBoxes(map, box));
        }
      } catch (error) {
        console.error("Error fetching boxes:", error);
      }
    };

    // Fetch boxes every 5 seconds
    fetchBoxes();
    const intervalId = setInterval(fetchBoxes, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // SEND CURRENT LOCATION
  const sendCurrentLocation = (position: GeolocationPosition, id: string, webSocket: WebSocket) => {
    const location = {
      id: id,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      timestamp: position.timestamp,
    };
    webSocket.send(JSON.stringify({ action: "sendmessage", data: location }));
  };

  const checkProximityToBoxes = (userLat: number, userLng: number) => {
    boxes.forEach((box) => {
      if (box.collected) return;
      const distance = calculateDistance(userLat, userLng, box.latitude, box.longitude);
      // TODO: update to 9 meters
      if (distance <= 1000) {
        console.log(`User is within 9 meters of box with id: ${box.id}`);
        setBoxCollect(box);
        setShowCollectButton(true);
      }
    });
  };

  // UPDATE PLAYER MARKERS
  const updateMarkers = (map: mapboxgl.Map, message: MarkerData) => {
    if (map && message.id && message.latitude && message.longitude) {
      const existingMarker = markersRef.current[message.id];

      console.log(`Updating marker: ${message.id}`);

      if (existingMarker) {
        // Marker exists, update its position
        existingMarker.setLngLat([message.longitude, message.latitude]);
      } else {
        if (message.id === user?.id) {
          // User marker
          const div = document.createElement("div");
          const img = document.createElement("img");
          div.className = "user-marker";
          img.src = user.pfp;
          div.appendChild(img);

          const newMarker = new mapboxgl.Marker(div).setLngLat([message.longitude, message.latitude]).addTo(map);

          markersRef.current[message.id] = newMarker;
        } else {
          // Marker doesn't exist, create a new one
          const el = document.createElement("div");
          el.className = "marker";

          const newMarker = new mapboxgl.Marker(el).setLngLat([message.longitude, message.latitude]).addTo(map);

          markersRef.current[message.id] = newMarker;
        }
      }
    }
  };

  const updateBoxes = (map: mapboxgl.Map, box: BoxData) => {
    if (map && box.id && box.latitude && box.longitude) {
      const existingBox = boxesRef.current[box.id];

      console.log(`Updating box: ${box.id}, Collected: ${box.collected}`);

      if (existingBox && box.collected) {
        // Box is collected, remove it from the map
        existingBox.remove();
        delete boxesRef.current[box.id]; // Remove from ref as well
      } else if (!existingBox && !box.collected) {
        // Box doesn't exist, create a new one
        const el = document.createElement("div");
        el.className = "box";

        const newMarker = new mapboxgl.Marker(el).setLngLat([box.longitude, box.latitude]).addTo(map);

        boxesRef.current[box.id] = newMarker;
      }
      // else the box is already there and not collected, do nothing
    }
  };

  const handleCollectClick = async () => {
    if (user?.id && boxCollect?.id) {
      try {
        console.log("Collecting box...");
        const response = await fetch(`${COLLECT_BOX_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { userId: user.id, boxId: boxCollect?.id },
          }),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        if (data.message) {
          setBoxCollect(null);
          setShowCollectButton(false);
          // router.push("/leaderboard");
        }
      } catch (error) {
        console.error("Error collecting box:", error);
      }
    }
  };

  return (
    <>
      <div
        ref={mapContainerRef}
        style={{
          height: "100vh",
          width: "100vw",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: "-1000",
        }}
      />
      {showCollectButton && (
        <div style={{ position: "fixed", left: "50%", top: "50%", zIndex: 100 }}>
          <button onClick={handleCollectClick}>Collect Box</button>
        </div>
      )}
    </>
  );
};

export default MapboxMap;
