"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import RouteChecklistModal from "./RouteChecklistModal";
import RouteMapControls from "./RouteMapControls";
import { updateLiveLocation } from "./routeMapLayers";
import { fetchTripDestinations, fetchRouteCoordinates } from "./routeMapApi";
import {
  clearAllRoutes,
  findNearestGasStation,
  findNearestRestaurant,
  findNearestTireRepair,
} from "./routeMapSearchActions";
import type { Coordinate } from "./routeMap.types";
import { fallbackPoint } from "./routeMapUtils";
import { useLanguage } from "@/app/lib/language";

import "mapbox-gl/dist/mapbox-gl.css";

const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface RouteMapProps {
  tripId?: string;
}

type TripDestination = {
  latitude: number;
  longitude: number;
  order?: number | null;
};

type TripResponse = {
  destinations?: TripDestination[];
};

export default function RouteMap({ tripId }: RouteMapProps) {
  const { language } = useLanguage();
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
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [gasStationStatus, setGasStationStatus] = useState("");


  const [isMapReady, setIsMapReady] = useState(false);

  
  useEffect(() => {
 

    if (!tripId || !mapRef.current || !isMapReady) return;

    async function drawTripRoute() {
      try {
        if (!mapRef.current) return;
        setGasStationStatus("Маршрут тооцоолж байна...");

 
        const destinations = await fetchTripDestinations(tripId!);

        // Хэрэглэгчийн одоогийн байршлыг эхлэх цэг (origin) болгож дамжуулна.
        const origin = {
          latitude: currentPointRef.current[1],
          longitude: currentPointRef.current[0],
        };

        // Явган аялал тул "walking" profile ашиглав.
        // Хэрэв "Машинтай аялал" бол "driving" болгож солиорой.
        const coordinates = await fetchRouteCoordinates(destinations, origin, "walking");

        const map = mapRef.current;


        if (!map.isStyleLoaded()) {
          map.once("style.load", () => {
            renderRouteLine(map, coordinates);
          });
        } else {
          renderRouteLine(map, coordinates);
        }

        setGasStationStatus("Маршрут амжилттай зурагдлаа.");
      } catch (err: any) {
        console.error("Маршрут зурахад алдаа гарлаа:", err);
        setGasStationStatus(
          err instanceof Error
            ? err.message
            : language === "en"
              ? "Could not draw the route."
              : "Маршрут зурж чадсангүй.",
        );
      }
    }

  
    // 🆕 2 давхаргат, цэвэрхэн харагдах маршрутын шугам зурах функц
    function renderRouteLine(map: mapboxgl.Map, coordinates: any) {
      if (!coordinates || coordinates.length === 0) return;

      // Хуучин layer/source-уудыг цэвэрлэнэ (casing болон main хоёуланг нь)
      if (map.getLayer("route-layer")) map.removeLayer("route-layer");
      if (map.getLayer("route-casing-layer")) map.removeLayer("route-casing-layer");
      if (map.getSource("route-source")) map.removeSource("route-source");

      map.addSource("route-source", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      });

      // 1-р давхарга: Гадна тал — цагаан "casing" хүрээ (шугамыг тод, цэвэрхэн харагдуулна)
      map.addLayer({
        id: "route-casing-layer",
        type: "line",
        source: "route-source",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ffffff",
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            10, 6,
            14, 10,
            18, 14,
          ],
          "line-opacity": 0.9,
        },
      });

      // 2-р давхарга: Дотор тал — цэнхэр гол шугам (casing-ээс нарийн)
      map.addLayer({
        id: "route-layer",
        type: "line",
        source: "route-source",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#2563eb", // цэвэрхэн, гүн цэнхэр (Apple/Google Maps шиг)
          "line-width": [
            "interpolate", ["linear"], ["zoom"],
            10, 3,
            14, 6,
            18, 9,
          ],
        },
      });

      const bounds = new mapboxgl.LngLatBounds(
        coordinates[0] as [number, number],
        coordinates[0] as [number, number]
      );

      for (const coord of coordinates) {
        bounds.extend(coord as [number, number]);
      }

 
      map.fitBounds(bounds, {
        padding: 80, 
        maxZoom: 12,
        duration: 2000 
      });
    }

    drawTripRoute();
  }, [tripId, isMapReady]); 


  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !accessToken) return;
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
      setIsMapReady(true); 

      if (!navigator.geolocation) return;
      watchId = navigator.geolocation.watchPosition(
        ({ coords }) => {
          const point = [coords.longitude, coords.latitude] as Coordinate;
          currentPointRef.current = point;
          updateLiveLocation(map, locationMarkerRef, point, coords.accuracy);
        },
        () => {
          map.easeTo({ center: fallbackPoint, zoom: 14, duration: 0 });
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
      );
    });

    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
      clearAllRoutes(map, { gas: gasMarkersRef, restaurant: restaurantMarkersRef, tireRepair: tireRepairMarkersRef });
      locationMarkerRef.current?.remove();
      map.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, []);

  const handleFindGasStation = async () => {
    if (!mapRef.current || !accessToken || isFindingGasStation) return;
    setIsFindingGasStation(true);
    try { await findNearestGasStation(getSearchContext()); } catch { } finally { setIsFindingGasStation(false); }
  };

  const handleFindRestaurant = async () => {
    if (!mapRef.current || !accessToken || isFindingRestaurant) return;
    setIsFindingRestaurant(true);
    try { await findNearestRestaurant(getSearchContext()); } catch { } finally { setIsFindingRestaurant(false); }
  };

  const handleFindTireRepair = async () => {
    if (!mapRef.current || !accessToken || isFindingTireRepair) return;
    setIsFindingTireRepair(true);
    try { await findNearestTireRepair(getSearchContext()); } catch { } finally { setIsFindingTireRepair(false); }
  };

  const handleRecenterLocation = () => {
    mapRef.current?.easeTo({ center: currentPointRef.current, zoom: Math.max(mapRef.current.getZoom(), 15), duration: 700 });
  };

  const getSearchContext = () => ({
    accessToken: accessToken as string,
    language,
    map: mapRef.current as mapboxgl.Map,
    markerRefs: { gas: gasMarkersRef, restaurant: restaurantMarkersRef, tireRepair: tireRepairMarkersRef },
    origin: currentPointRef.current,
    setStatus: setGasStationStatus,
  });

  return (
    <div className="relative h-full w-full bg-slate-100">
      {accessToken ? <div ref={mapContainerRef} className="h-full w-full" /> : <div className="flex h-full w-full items-center justify-center text-slate-500">Add Token</div>}
      <RouteMapControls
        gasStationStatus={gasStationStatus}
        language={language}
        isFindingGasStation={isFindingGasStation}
        isFindingRestaurant={isFindingRestaurant}
        isFindingTireRepair={isFindingTireRepair}
        onFindGasStation={handleFindGasStation}
        onFindRestaurant={handleFindRestaurant}
        onFindTireRepair={handleFindTireRepair}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onRecenterLocation={handleRecenterLocation}
      />
      {isChecklistOpen && <RouteChecklistModal onClose={() => setIsChecklistOpen(false)} />}
    </div>
  );
}
