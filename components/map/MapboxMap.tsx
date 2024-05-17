"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import mapboxgl from "mapbox-gl";

import styles from "./MapboxMap.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { useUser, useLocationSocket } from "@/hooks";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

const MapboxMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapMoved, setMapMoved] = useState(false);

  const user = useUser();
  const { currentLocation, markersRef } = useLocationSocket(user, mapRef);

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
