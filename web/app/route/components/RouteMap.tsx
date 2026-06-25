"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

const startPoint = [106.9176, 47.9188] as [number, number];
const endPoint = [106.929, 47.915] as [number, number];
const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function RouteMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !accessToken) {
      return;
    }

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: startPoint,
      zoom: 14,
      pitch: 30,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    const bounds = new mapboxgl.LngLatBounds(startPoint, startPoint).extend(endPoint);

    map.on("load", () => {
      map.addSource("route-line", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [startPoint, endPoint],
          },
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route-line",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#2563eb",
          "line-width": 5,
          "line-opacity": 0.9,
        },
      });

      new mapboxgl.Marker({ color: "#2563eb" }).setLngLat(startPoint).addTo(map);
      new mapboxgl.Marker({ color: "#16a34a" }).setLngLat(endPoint).addTo(map);

      map.fitBounds(bounds, {
        padding: { top: 170, right: 48, bottom: 120, left: 48 },
        duration: 0,
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full bg-slate-100">
      {accessToken ? (
        <div ref={mapContainerRef} className="h-full w-full" />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-8 text-center text-sm font-medium text-slate-500">
          Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to show the Mapbox map.
        </div>
      )}

      <div className="absolute left-4 right-4 top-14 z-10 rounded-[1.4rem] bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-[10px] font-semibold uppercase text-slate-500">
          Route
        </p>
        <p className="text-sm font-semibold text-slate-900">Central Park - Old Town</p>
      </div>
    </div>
  );
}
