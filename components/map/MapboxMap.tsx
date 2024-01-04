"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { calculateDistance } from "@/utils";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./MapboxMap.module.css";

import type { MarkerData, BoxData, User } from "@/types";
import { LOCATION_SOCKET_URL, GET_BOXES_URL, COLLECT_BOX_URL } from "@/utils/constants";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

type MarkersObject = {
  [id: string]: mapboxgl.Marker;
};

const MapboxMap: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [user, setUser] = useState<User | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersSocket = useRef<WebSocket | null>(null);
  const markersRef = useRef<MarkersObject>({});
  const boxesRef = useRef<MarkersObject>({});
  const [boxes, setBoxes] = useState<BoxData[]>([]);
  const [boxCollect, setBoxCollect] = useState<BoxData | null>(null);
  const [showCollectButton, setShowCollectButton] = useState(false);

  useEffect(() => {
    console.log(session?.user);
    if (session?.user) {
      setUser(session.user as User);
    }
  }, [session]);

  // SETUP MAP
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [-71.13637993467633, 42.35611312704494],
      zoom: 15,
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
      if (!user) return;
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          console.log("position", position);
          console.log("boxes", boxes);
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

  // GET BOXES
  useEffect(() => {
    let isMounted = true;

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
      } finally {
        if (isMounted) {
          setTimeout(fetchBoxes, 1000);
        }
      }
    };

    fetchBoxes();

    return () => {
      isMounted = false;
    };
  }, [user]);

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
          img.src = user.image;
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

      // console.log(`Updating box: ${box.id}, Collected: ${box.collected}`);

      // TODO: user object only has name and image, not id
      if (existingBox && box.collected && box.username === user?.username) {
        // if I have collected a box show pink icon
        const existingBoxElement = existingBox.getElement() as HTMLImageElement;
        existingBoxElement.src = "/icons/box-opened.svg";
      } else if (existingBox && box.collected) {
        // if someone else has collected a box show grey icon
        const existingBoxElement = existingBox.getElement() as HTMLImageElement;
        existingBoxElement.src = "/icons/box-grey.svg";
      } else if (!existingBox) {
        // Box doesn't exist, create a new one
        // const el = document.createElement("img");
        // el.className = "box";
        const img = document.createElement("img");
        img.className = "box";
        img.src = "/icons/box-closed.svg";
        // el.appendChild(img);

        const newMarker = new mapboxgl.Marker(img).setLngLat([box.longitude, box.latitude]).addTo(map);

        boxesRef.current[box.id] = newMarker;
      }
      // else the box is already there and not collected, do nothing
    }
  };

  const handleCollectBox = async () => {
    if (user?.id && boxCollect?.id) {
      try {
        console.log("Collecting box...");
        const response = await fetch(`${COLLECT_BOX_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: { userId: user.id, boxId: boxCollect?.id, username: user.username, pfp: user.image },
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

          router.push(`/claim/${boxCollect.points}`);
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
        <button className={styles.collectButton} onClick={handleCollectBox}>
          Claim
        </button>
      )}
    </>
  );
};

export default MapboxMap;
