import mapboxgl from "mapbox-gl";
import type { Coordinate, GasStation, RouteLineGeometry } from "./routeMap.types";
import {
  gasRouteLayerId,
  gasRouteSourceId,
  getDistanceMeters,
  locationAccuracySourceId,
} from "./routeMapUtils";

type MarkerRef = {
  current: mapboxgl.Marker | null;
};

type RenderedFeature = {
  id?: string | number;
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
  properties?: Record<string, unknown> | null;
};

export const updateLiveLocation = (
  map: mapboxgl.Map,
  markerRef: MarkerRef,
  point: Coordinate,
  accuracy: number,
) => {
  if (!markerRef.current) {
    markerRef.current = new mapboxgl.Marker({ color: "#2563eb" }).setLngLat(point).addTo(map);
  } else {
    markerRef.current.setLngLat(point);
  }

  upsertAccuracyCircle(map, point, accuracy);
  map.easeTo({ center: point, zoom: Math.max(map.getZoom(), 15), duration: 700 });
};

export const clearGasStationRoute = (map: mapboxgl.Map, markers: mapboxgl.Marker[]) => {
  markers.forEach((marker) => marker.remove());

  if (map.getLayer(gasRouteLayerId)) {
    map.removeLayer(gasRouteLayerId);
  }

  if (map.getSource(gasRouteSourceId)) {
    map.removeSource(gasRouteSourceId);
  }
};

export const drawNearestGasStationRoute = (
  map: mapboxgl.Map,
  origin: Coordinate,
  station: GasStation,
  geometry: RouteLineGeometry,
) => {
  map.addSource(gasRouteSourceId, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {},
      geometry,
    },
  });

  map.addLayer({
    id: gasRouteLayerId,
    type: "line",
    source: gasRouteSourceId,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#f97316",
      "line-width": 5,
      "line-opacity": 0.9,
    },
  });

  const popup = new mapboxgl.Popup({ offset: 24 }).setText(
    station.address ? `${station.name} - ${station.address}` : station.name,
  );
  const marker = new mapboxgl.Marker({ color: "#f97316" })
    .setLngLat(station.center)
    .setPopup(popup)
    .addTo(map);

  fitGeometry(map, origin, geometry);
  return marker;
};

export const getRenderedGasStations = (map: mapboxgl.Map, origin: Coordinate) => {
  const features = map.queryRenderedFeatures();

  return features
    .map((feature, index) => {
      const renderedFeature = feature as RenderedFeature;
      const coordinates = getPointCoordinates(renderedFeature.geometry);

      if (!coordinates || !isFuelFeature(renderedFeature.properties)) {
        return null;
      }

      return {
        id: `rendered-${renderedFeature.id ?? index}`,
        name: getFeatureName(renderedFeature.properties),
        center: coordinates,
        distanceMeters: getDistanceMeters(origin, coordinates),
      };
    })
    .filter((station): station is GasStation => station !== null);
};

const upsertAccuracyCircle = (map: mapboxgl.Map, point: Coordinate, accuracy: number) => {
  const accuracyData = {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "Point" as const,
      coordinates: point,
    },
  };
  const accuracySource = map.getSource(locationAccuracySourceId) as
    | mapboxgl.GeoJSONSource
    | undefined;

  if (accuracySource) {
    accuracySource.setData(accuracyData);
    return;
  }

  map.addSource(locationAccuracySourceId, {
    type: "geojson",
    data: accuracyData,
  });
  map.addLayer({
    id: locationAccuracySourceId,
    type: "circle",
    source: locationAccuracySourceId,
    paint: {
      "circle-radius": Math.min(Math.max(accuracy / 8, 18), 70),
      "circle-color": "#2563eb",
      "circle-opacity": 0.14,
      "circle-stroke-color": "#2563eb",
      "circle-stroke-opacity": 0.3,
      "circle-stroke-width": 1,
    },
  });
};

const fitGeometry = (map: mapboxgl.Map, origin: Coordinate, geometry: RouteLineGeometry) => {
  const bounds = geometry.coordinates.reduce(
    (routeBounds, coordinate) => routeBounds.extend(coordinate as Coordinate),
    new mapboxgl.LngLatBounds(origin, origin),
  );

  map.fitBounds(bounds, {
    padding: { top: 110, right: 42, bottom: 110, left: 86 },
    maxZoom: 16,
    duration: 900,
  });
};

const getPointCoordinates = (geometry: RenderedFeature["geometry"]) => {
  if (geometry?.type !== "Point" || !Array.isArray(geometry.coordinates)) {
    return null;
  }

  const coordinates = geometry.coordinates;

  if (typeof coordinates[0] !== "number" || typeof coordinates[1] !== "number") {
    return null;
  }

  return [coordinates[0], coordinates[1]] as Coordinate;
};

const getFeatureName = (properties: RenderedFeature["properties"]) => {
  return (
    getProperty(properties, "name") ??
    getProperty(properties, "name_en") ??
    getProperty(properties, "brand") ??
    "Gas station"
  );
};

const isFuelFeature = (properties: RenderedFeature["properties"]) => {
  const label = [
    "maki",
    "class",
    "type",
    "category",
    "category_en",
    "name",
    "name_en",
    "brand",
  ]
    .map((key) => getProperty(properties, key))
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    label.includes("fuel") ||
    label.includes("gas") ||
    label.includes("petrol") ||
    label.includes("benz")
  );
};

const getProperty = (
  properties: RenderedFeature["properties"],
  key: string,
) => {
  const value = properties?.[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
};
