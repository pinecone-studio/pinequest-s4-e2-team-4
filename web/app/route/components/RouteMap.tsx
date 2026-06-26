"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import RouteMapControls from "./RouteMapControls";
import { fetchDrivingRoute, fetchNearbyGasStations } from "./routeMapApi";
import {
  clearGasStationRoute,
  drawNearestGasStationRoute,
  getRenderedGasStations,
  updateLiveLocation,
} from "./routeMapLayers";
import type { Coordinate } from "./routeMap.types";
import { fallbackPoint, formatDistance } from "./routeMapUtils";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function RouteMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const locationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const currentPointRef = useRef<Coordinate>(fallbackPoint);
  const gasMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [isFindingGasStation, setIsFindingGasStation] = useState(false);
  const [gasStationStatus, setGasStationStatus] = useState("");

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !accessToken) {
      return;
    }

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: fallbackPoint,
      zoom: 14,
      pitch: 30,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");

    let watchId: number | undefined;

    map.on("load", () => {
      if (!navigator.geolocation) {
        setGasStationStatus("Location is not supported by this browser.");
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        ({ coords }) => {
          const point = [coords.longitude, coords.latitude] as Coordinate;
          currentPointRef.current = point;
          updateLiveLocation(map, locationMarkerRef, point, coords.accuracy);
        },
        () => {
          setGasStationStatus("Allow location permission to show your exact position.");
          map.easeTo({ center: fallbackPoint, zoom: 14, duration: 0 });
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
      );
    });

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }

      clearGasStationRoute(map, gasMarkersRef.current);
      gasMarkersRef.current = [];
      locationMarkerRef.current?.remove();
      locationMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const handleFindGasStation = async () => {
    if (!mapRef.current || !accessToken || isFindingGasStation) {
      return;
    }

    const map = mapRef.current;
    const origin = currentPointRef.current;

    setIsFindingGasStation(true);
    setGasStationStatus("Searching nearby gas stations...");

    try {
      const apiGasStations = await fetchNearbyGasStations(origin, 7000, accessToken);
      const renderedGasStations = getRenderedGasStations(map, origin);
      const gasStations = [...renderedGasStations, ...apiGasStations]
        .filter(
          (station, index, stations) =>
            stations.findIndex(
              (candidate) =>
                Math.abs(candidate.center[0] - station.center[0]) < 0.0007 &&
                Math.abs(candidate.center[1] - station.center[1]) < 0.0007,
            ) === index,
        )
        .sort((first, second) => first.distanceMeters - second.distanceMeters);

      clearGasStationRoute(map, gasMarkersRef.current);
      gasMarkersRef.current = [];

      if (gasStations.length === 0) {
        setGasStationStatus("No gas stations found within 7 km.");
        return;
      }

      setGasStationStatus(`${gasStations.length} gas station candidates found. Checking routes...`);

      const routeCandidates = await Promise.all(
        gasStations.slice(0, 15).map(async (station) => ({
          station,
          route: await fetchDrivingRoute(origin, station.center, accessToken),
        })),
      );
      const nearestCandidate = routeCandidates.sort(
        (first, second) =>
          (first.route?.distance ?? first.station.distanceMeters) -
          (second.route?.distance ?? second.station.distanceMeters),
      )[0];
      const nearestStation = nearestCandidate.station;
      const route = nearestCandidate.route;
      const routeGeometry =
        route?.geometry ??
        ({
          type: "LineString",
          coordinates: [origin, nearestStation.center],
        } as const);
      const routeDistance = route?.distance ?? nearestStation.distanceMeters;

      gasMarkersRef.current = [
        drawNearestGasStationRoute(map, origin, nearestStation, routeGeometry),
      ];
      setGasStationStatus(
        `Тантай хамгийн ойр шатахуун түгээх станц ${formatDistance(routeDistance)} зайд байна.`,
      );
    } catch {
      setGasStationStatus("Could not load nearby gas stations.");
    } finally {
      setIsFindingGasStation(false);
    }
  };

  const handleRecenterLocation = () => {
    mapRef.current?.easeTo({
      center: currentPointRef.current,
      zoom: Math.max(mapRef.current.getZoom(), 15),
      duration: 700,
    });
  };

  return (
    <div className="relative h-full w-full bg-slate-100">
      {accessToken ? (
        <div ref={mapContainerRef} className="h-full w-full" />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-8 text-center text-sm font-medium text-slate-500">
          Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to show the Mapbox map.
        </div>
      )}

      <RouteMapControls
        gasStationStatus={gasStationStatus}
        isFindingGasStation={isFindingGasStation}
        onFindGasStation={handleFindGasStation}
        onRecenterLocation={handleRecenterLocation}
      />
    </div>
  );
}
