"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import RouteMapControls from "./RouteMapControls";
import { updateLiveLocation } from "./routeMapLayers";
import {
  clearAllRoutes,
  findNearestGasStation,
  findNearestRestaurant,
  findNearestTireRepair,
} from "./routeMapSearchActions";
import type { Coordinate } from "./routeMap.types";
import { fallbackPoint } from "./routeMapUtils";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;


interface RouteMapProps {
  tripId?: string;
}

export default function RouteMap({ tripId }: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const locationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const currentPointRef = useRef<Coordinate>(fallbackPoint);
  const gasMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const restaurantMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const tireRepairMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const [isFindingGasStation, setIsFindingGasStation] = useState(false);
  const [isFindingRestaurant, setIsFindingRestaurant] = useState(false);
  const [isFindingTireRepair, setIsFindingTireRepair] = useState(false);
  const [gasStationStatus, setGasStationStatus] = useState("");

  useEffect(() => {
    if (tripId) {
      console.log("Сонгогдсон аяллын ID:", tripId);
   
    }
  }, [tripId]);

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

      clearAllRoutes(map, {
        gas: gasMarkersRef,
        restaurant: restaurantMarkersRef,
        tireRepair: tireRepairMarkersRef,
      });
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

    setIsFindingGasStation(true);

    try {
      await findNearestGasStation(getSearchContext());
    } catch {
      setGasStationStatus("Таны ойролцоох шатахуун түгээх станцуудыг олж чадсангүй.");
    } finally {
      setIsFindingGasStation(false);
    }
  };

  const handleFindRestaurant = async () => {
    if (!mapRef.current || !accessToken || isFindingRestaurant) {
      return;
    }

    setIsFindingRestaurant(true);

    try {
      await findNearestRestaurant(getSearchContext());
    } catch {
      setGasStationStatus("Таны ойролцоох хоолны газруудыг олж чадсангүй.");
    } finally {
      setIsFindingRestaurant(false);
    }
  };

  const handleFindTireRepair = async () => {
    if (!mapRef.current || !accessToken || isFindingTireRepair) {
      return;
    }

    setIsFindingTireRepair(true);

    try {
      await findNearestTireRepair(getSearchContext());
    } catch {
      setGasStationStatus("Таны ойролцоох дугуй засварыг олж чадсангүй.");
    } finally {
      setIsFindingTireRepair(false);
    }
  };

  const handleRecenterLocation = () => {
    mapRef.current?.easeTo({
      center: currentPointRef.current,
      zoom: Math.max(mapRef.current.getZoom(), 15),
      duration: 700,
    });
  };

  const getSearchContext = () => ({
    accessToken: accessToken as string,
    map: mapRef.current as mapboxgl.Map,
    markerRefs: {
      gas: gasMarkersRef,
      restaurant: restaurantMarkersRef,
      tireRepair: tireRepairMarkersRef,
    },
    origin: currentPointRef.current,
    setStatus: setGasStationStatus,
  });

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
        isFindingRestaurant={isFindingRestaurant}
        isFindingTireRepair={isFindingTireRepair}
        onFindGasStation={handleFindGasStation}
        onFindRestaurant={handleFindRestaurant}
        onFindTireRepair={handleFindTireRepair}
        onRecenterLocation={handleRecenterLocation}
      />
    </div>
  );
}