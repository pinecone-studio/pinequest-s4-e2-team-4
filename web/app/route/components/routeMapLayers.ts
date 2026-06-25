import mapboxgl from "mapbox-gl";
import type { Coordinate, GasStation } from "./routeMap.types";
import { gasRouteLayerId, gasRouteSourceId, locationAccuracySourceId } from "./routeMapUtils";

type MarkerRef = {
  current: mapboxgl.Marker | null;
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
  geometry: GeoJSON.LineString,
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

const fitGeometry = (map: mapboxgl.Map, origin: Coordinate, geometry: GeoJSON.LineString) => {
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
