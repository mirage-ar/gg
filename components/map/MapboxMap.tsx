"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/hooks";
import { encodeGeoHash } from "@/utils/geoHash";
import { rand } from "@/utils";

import styles from "./MapboxMap.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

import type { MarkerData, BoxData } from "@/types";
import { LOCATION_SOCKET_URL } from "@/utils/constants";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

type MarkersObject = {
  [id: string]: mapboxgl.Marker;
};

const MapboxMap: React.FC = () => {
  const router = useRouter();
  const user = useUser();

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapCenteredRef = useRef(false);
  const markersSocket = useRef<WebSocket | null>(null);
  const markersRef = useRef<MarkersObject>({});
  const boxesRef = useRef<MarkersObject>({});
  const [boxCollect, setBoxCollect] = useState<BoxData | null>(null);
  const [showCollectButton, setShowCollectButton] = useState(false);

  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [mapMoved, setMapMoved] = useState(false);

  // SETUP MAP
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      // TODO: update to new york and zoomed out
      center: [-71.13637993467633, 42.35611312704494],
      zoom: 18,
      pitch: 15,
    });

    map.on("style.load", () => {
      // @ts-ignore
      map.setConfigProperty("basemap", "lightPreset", "night");
      // @ts-ignore
      map.setConfigProperty("basemap", "showPointOfInterestLabels", false);
    });

    map.on("load", function () {
      map.addSource("boxes-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.loadImage("/icons/map/box-closed.png", (error, image) => {
        if (error) throw error;
        map.addImage("boxClosed", image as HTMLImageElement);
      });

      map.loadImage("/icons/map/box-opened.png", (error, image) => {
        if (error) throw error;
        map.addImage("boxOpened", image as HTMLImageElement);
      });

      map.addLayer({
        id: "boxes-layer",
        type: "symbol", // Change the type to symbol to use images
        source: "boxes-source",
        layout: {
          "icon-image": [
            "match",
            ["get", "boxType"], // Use the 'boxType' property
            "opened",
            "boxOpened", // If 'boxType' is 'opened', use 'boxOpened'
            "closed",
            "boxClosed", // If 'boxType' is 'closed', use 'boxClosed'
            "boxClosed", // Default image if 'boxType' doesn't match
          ],
        },
      });
    });

    // Add a 'move' event listener
    map.on("move", () => {
      setMapMoved(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      map.off("move", () => setMapMoved(true));
    };
  }, []);

  const fetchAndUpdateBoxes = async (latitude: number, longitude: number) => {
    try {
      const userGeoHash = encodeGeoHash(latitude, longitude);
      const response = await fetch(`api/boxes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.id, geoHash: userGeoHash, latitude, longitude }),
      });
      const data = await response.json();

      // check if user can collect box
      if (data.collect) {
        router.push(`/claim/${data.collect.points}`);
      }

      // update box markers
      const map = mapRef.current;
      if (map && map.getSource("boxes-source")) {
        const boxesSource = map.getSource("boxes-source") as mapboxgl.GeoJSONSource;
        if (boxesSource) {
          boxesSource.setData(data.boxes);
        }
      }
    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
  };

  // Markers Socket
  useEffect(() => {
    if (!user) return;

    let watchId: number;
    let reconnectAttempts = 0;

    const connectWebSocket = () => {
      markersSocket.current = new WebSocket(LOCATION_SOCKET_URL);

      markersSocket.current.onopen = () => {
        console.log("WebSocket Connected");
        // location tracking
        if (!user) return;
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            // TODO: add center on map button to center on user
            // STORE CURRENT POSITION (TESTING)
            setCurrentLocation(position);

            // CENTER MAP ON USER IF FIRST TIME
            if (!mapCenteredRef.current) {
              const map = mapRef.current;
              if (map) {
                mapCenteredRef.current = true;
                map.setCenter([position.coords.longitude, position.coords.latitude]);
              }
            }

            // FETCH BOXES AND UPDATE MARKERS
            fetchAndUpdateBoxes(position.coords.latitude, position.coords.longitude);

            // SEND USER LOCATION
            if (markersSocket.current && markersSocket.current.readyState === WebSocket.OPEN && user?.id) {
              const location = {
                id: user.id,
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

      markersSocket.current.onmessage = (event: MessageEvent) => {
        const message: MarkerData = JSON.parse(event.data);
        const map = mapRef.current;
        if (map) updateMarkers(map, message);
      };

      markersSocket.current.onerror = (error) => {
        console.error("WebSocket Error", error);
      };

      markersSocket.current.onclose = () => {
        console.log("WebSocket Disconnected");
        // Initiate a reconnect attempt
        scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      const maxReconnectAttempts = 5;
      if (reconnectAttempts < maxReconnectAttempts) {
        // Exponential backoff formula: Math.min(1000 * 2 ** reconnectAttempts, 30000);
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        setTimeout(() => {
          reconnectAttempts++;
          console.log(`Reconnecting attempt #${reconnectAttempts}`);
          connectWebSocket(); // Attempt to reconnect
        }, delay);
      } else {
        console.log("Max reconnect attempts reached. Giving up.");
      }
    };

    // Initial connection
    connectWebSocket();

    return () => {
      markersSocket.current?.close();
      navigator.geolocation.clearWatch(watchId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
          img.src = user?.image;
          div.appendChild(img);

          const newMarker = new mapboxgl.Marker(div).setLngLat([message.longitude, message.latitude]).addTo(map);

          markersRef.current[message.id] = newMarker;
        } else {
          // Marker doesn't exist, create a new one
          const el = document.createElement("img");
          el.className = "marker";
          el.src = `/icons/markers/${rand(1, 5)}.svg`;

          const newMarker = new mapboxgl.Marker(el).setLngLat([message.longitude, message.latitude]).addTo(map);

          markersRef.current[message.id] = newMarker;
        }
      }
    }
  };

  const centerOnUser = () => {
    console.log("Centering on user");
    if (currentLocation && mapRef.current) {
      // mapRef.current.setCenter([currentLocation.coords.longitude, currentLocation.coords.latitude]);
      mapRef.current.flyTo({
        center: [currentLocation.coords.longitude, currentLocation.coords.latitude],
        zoom: 18,
        pitch: 15,
        essential: true,
        easing: (time: number) => {
          // complex logic to hide button after map moved
          if (time === 1) {
            console.log("Map moved");
            setTimeout(() => {
              setMapMoved(false);
            }, 500);
          }

          return time;
        },
      });
      // setTimeout(() => {
      //   setMapMoved(false);
      // }, 1000);
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
      {showCollectButton && <button className={styles.collectButton}>Claim</button>}
      {mapMoved && (
        <button className={styles.centerButton} onClick={centerOnUser}>
          <Image src="/icons/map/center.svg" width={48} height={48} alt="Center User" />
        </button>
      )}
    </>
  );
};

export default MapboxMap;
