"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/hooks";
import { encodeGeoHash } from "@/utils/geoHash";

import styles from "./MapboxMap.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

import type { LocationData } from "@/types";
import { API, LOCATION_SOCKET_URL } from "@/utils/constants";

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
  const userIdRef = useRef<string | null>(null);

  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [mapMoved, setMapMoved] = useState(false);

  // const [hasOnboarded, setHasOnboarded] = useState(false);

  // useEffect(() => {
  //   const hasOnboardedValue = JSON.parse(localStorage.getItem("hasOnboarded") || "false");
  //   if (hasOnboardedValue) {
  //     setHasOnboarded(JSON.parse(hasOnboardedValue));
  //   }
  // }, [hasOnboarded]);

  // SETUP MAP
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      center: [-73.97763959039685, 40.76144130742262],
      zoom: 2,
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

    map.on("zoom", () => {
      const currentZoom: number = map.getZoom();
      // Check if the user marker exists and has an element attached
      if (userIdRef.current) {
        const marker = markersRef.current[userIdRef.current];
        if (marker) {
          updateMarkerSize(marker, currentZoom);
        }
      }
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
      const response = await fetch(`${API}/collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          geoHash: userGeoHash,
          latitude,
          longitude,
          collectorUsername: user?.username,
          collectorImage: user?.image,
        }),
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
        if (boxesSource && data.boxes) {
          boxesSource.setData(data.boxes);
        }
      }
    } catch (error) {
      console.error("Error fetching boxes:", error);
    }
  };

  // Markers Socket
  useEffect(() => {
    if (!user?.id) return;
    // set user id
    userIdRef.current = user.id;

    let watchId: number;

    const connectWebSocket = () => {
      markersSocket.current = new WebSocket(LOCATION_SOCKET_URL);

      markersSocket.current.onopen = () => {
        console.log("WebSocket Connected");

        // location tracking
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            // STORE CURRENT POSITION
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
            const hasOnboarded = JSON.parse(localStorage.getItem("hasOnboarded") || "false");
            if (hasOnboarded) {
              fetchAndUpdateBoxes(position.coords.latitude, position.coords.longitude);
            }

            // SEND USER LOCATION
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

      markersSocket.current.onmessage = (event: MessageEvent) => {
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
        setTimeout(connectWebSocket, 3000); // Attempt to reconnect after 3 seconds
      };
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
  const updateMarkers = (map: mapboxgl.Map, message: LocationData) => {
    if (map && message.id && message.latitude && message.longitude) {
      const existingMarker = markersRef.current[message.id];

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

          // updateMarkerSize(div, map.getZoom());

          const newMarker = new mapboxgl.Marker(div).setLngLat([message.longitude, message.latitude]).addTo(map);

          markersRef.current[message.id] = newMarker;
        } else {
          // Marker doesn't exist, create a new one
          const el = document.createElement("img");
          el.className = "marker";
          el.src = message.image;
          // el.src = `/icons/markers/${rand(1, 5)}.svg`;

          const newMarker = new mapboxgl.Marker(el).setLngLat([message.longitude, message.latitude]).addTo(map);

          markersRef.current[message.id] = newMarker;
        }
      }
    }
  };

  const centerOnUser = () => {
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
            setTimeout(() => {
              setMapMoved(false);
            }, 500);
          }

          return time;
        },
      });
    }
  };

  function updateMarkerSize(marker: mapboxgl.Marker, mapZoom: number): void {
    const baseSize = 100;
    const minZoomLevel = 18;
    const size = baseSize * Math.pow(2, mapZoom - minZoomLevel);
    const markerElement = marker.getElement();
    markerElement.style.width = `${size}px`;
    markerElement.style.height = `${size}px`;
  }

  return (
    <>
      <div
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: "-1000",
        }}
      />
      {mapMoved && (
        <button className={styles.centerButton} onClick={centerOnUser}>
          <Image src="/icons/map/center.svg" width={64} height={64} alt="Center User" />
        </button>
      )}
    </>
  );
};

export default MapboxMap;
