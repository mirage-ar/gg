"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/hooks";
import { encodeGeoHash } from "@/utils/geoHash";
import styles from "./MapboxMap.module.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { API } from "@/utils/constants";
import useLocationSocket from "@/hooks/useLocationSocket";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

const MapboxMap: React.FC = () => {
  const router = useRouter();
  const user = useUser();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapMoved, setMapMoved] = useState(false);

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
      if (data.collect) {
        router.push(`/claim/${data.collect.points}`);
      }

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

  const { currentLocation, markersRef } = useLocationSocket(user, mapRef, fetchAndUpdateBoxes);

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

    map.on("load", () => {
      map.addSource("boxes-source", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
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
        type: "symbol",
        source: "boxes-source",
        layout: {
          "icon-image": ["match", ["get", "boxType"], "opened", "boxOpened", "closed", "boxClosed", "boxClosed"],
        },
      });
    });

    map.on("move", () => setMapMoved(true));
    map.on("zoom", () => {
      const currentZoom: number = map.getZoom();
      for (const marker in markersRef.current) {
        // @ts-ignore
        updateMarkerSize(markersRef.current[marker], currentZoom);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const centerOnUser = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [currentLocation.coords.longitude, currentLocation.coords.latitude],
        zoom: 18,
        pitch: 15,
        essential: true,
        easing: (time: number) => {
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
        style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0, zIndex: "-1000" }}
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
