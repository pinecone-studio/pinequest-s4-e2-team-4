"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import RouteChecklistModal from "./RouteChecklistModal";
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
import { useLanguage } from "@/app/lib/language";

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

  useEffect(() => {
    if (!tripId || !mapRef.current) return;

    async function drawTripRoute() {
      try {
        if (!mapRef.current) return;
        
        setGasStationStatus(language === "en" ? "Loading route..." : "Маршрут ачаалж байна...");

   
        const tripRes = await fetch(`/api/trips/${tripId}`);
        if (!tripRes.ok) throw new Error(language === "en" ? "Trip data was not found." : "Аяллын дата олдсонгүй.");
        const tripData = (await tripRes.json()) as TripResponse;
        
        if (!tripData.destinations || tripData.destinations.length === 0) {
          throw new Error(language === "en" ? "No destinations were registered for this trip." : "Аялалд бүртгэгдсэн очих газар олдсонгүй.");
        }

        const map = mapRef.current;

      
        if (map.getLayer("route-layer")) map.removeLayer("route-layer");
        if (map.getSource("route-source")) map.removeSource("route-source");

       
        const coordinates: Coordinate[] = tripData.destinations
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((destination) => [destination.longitude, destination.latitude]);

        if (coordinates.length < 2) {
          throw new Error(language === "en" ? "At least 2 points are required to draw a route." : "Маршрут зурахад хамгийн багадаа 2 цэг шаардлагатай.");
        }

      
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

        map.addLayer({
          id: "route-layer",
          type: "line",
          source: "route-source",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#38bdf8", 
            "line-width": 6,          
          },
        });

       
        map.flyTo({
          center: coordinates[0],
          zoom: 10,
          essential: true,
        });

        setGasStationStatus(language === "en" ? "Route drawn successfully." : "Маршрут амжилттай зурагдлаа.");

      } catch (err: unknown) {
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

    if (mapRef.current.isStyleLoaded()) {
      drawTripRoute();
    } else {
      mapRef.current.on("style.load", drawTripRoute);
    }

  }, [tripId, language]);

 
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
      setGasStationStatus(language === "en" ? "Could not find nearby gas stations." : "Таны ойролцоох шатахуун түгээх станцуудыг олж чадсангүй.");
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
      setGasStationStatus(language === "en" ? "Could not find nearby restaurants." : "Таны ойролцоох хоолны газруудыг олж чадсангүй.");
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
      setGasStationStatus(language === "en" ? "Could not find nearby tire repair shops." : "Таны ойролцоох дугуй засварыг олж чадсангүй.");
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
    language,
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

      {isChecklistOpen && (
        <RouteChecklistModal onClose={() => setIsChecklistOpen(false)} />
      )}
    </div>
  );
}
