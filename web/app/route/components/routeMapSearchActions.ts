import mapboxgl from "mapbox-gl";
import type { MutableRefObject } from "react";
import { fetchDrivingRoute, fetchNearbyGasStations } from "./routeMapApi";
import {
  clearGasStationRoute,
  drawNearestGasStationRoute,
  getRenderedGasStations,
} from "./routeMapLayers";
import type { Coordinate, RouteLineGeometry } from "./routeMap.types";
import { formatDistance } from "./routeMapUtils";
import {
  fetchNearbyRestaurants,
  fetchRestaurantDrivingRoute,
} from "./routeRestaurantApi";
import {
  clearRestaurantRoute,
  drawNearestRestaurantRoute,
} from "./routeRestaurantLayers";
import {
  fetchNearbyTireRepairs,
  fetchTireRepairDrivingRoute,
} from "./routeTireRepairApi";
import {
  clearTireRepairRoute,
  drawNearestTireRepairRoute,
} from "./routeTireRepairLayers";

type MarkerRefs = {
  gas: MutableRefObject<mapboxgl.Marker[]>;
  restaurant: MutableRefObject<mapboxgl.Marker[]>;
  tireRepair: MutableRefObject<mapboxgl.Marker[]>;
};

type SearchContext = {
  accessToken: string;
  map: mapboxgl.Map;
  markerRefs: MarkerRefs;
  origin: Coordinate;
  setStatus: (status: string) => void;
};

export const clearAllRoutes = (map: mapboxgl.Map, markerRefs: MarkerRefs) => {
  clearGasStationRoute(map, markerRefs.gas.current);
  markerRefs.gas.current = [];
  clearRestaurantRoute(map, markerRefs.restaurant.current);
  markerRefs.restaurant.current = [];
  clearTireRepairRoute(map, markerRefs.tireRepair.current);
  markerRefs.tireRepair.current = [];
};

export const findNearestGasStation = async ({
  accessToken,
  map,
  markerRefs,
  origin,
  setStatus,
}: SearchContext) => {
  setStatus("Таны ойролцоох шатахуун түгээх станцуудыг хайж байна...");

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

  clearAllRoutes(map, markerRefs);

  if (gasStations.length === 0) {
    setStatus("7 км-ийн хүрээнд шатахуун түгээх станц олдсонгүй.");
    return;
  }

  setStatus(`${gasStations.length} шатахуун түгээх станц олдлоо. Замуудыг шалгаж байна...`);

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
    route?.geometry ?? createFallbackRoute(origin, nearestStation.center);
  const routeDistance = route?.distance ?? nearestStation.distanceMeters;

  markerRefs.gas.current = [
    drawNearestGasStationRoute(map, origin, nearestStation, routeGeometry),
  ];
  setStatus(
    `Тантай хамгийн ойр шатахуун түгээх станц ${formatDistance(routeDistance)} зайд байна.`,
  );
};

export const findNearestRestaurant = async ({
  accessToken,
  map,
  markerRefs,
  origin,
  setStatus,
}: SearchContext) => {
  setStatus("Таны ойролцоох хоолны газруудыг хайж байна...");

  const restaurants = await fetchNearbyRestaurants(origin, 5000, accessToken);
  clearAllRoutes(map, markerRefs);

  if (restaurants.length === 0) {
    setStatus("5 км-ийн хүрээнд ойролцоох хоолны газар олдсонгүй.");
    return;
  }

  setStatus(`${restaurants.length} хоолны газар олдлоо. Замуудыг шалгаж байна...`);

  const routeCandidates = await Promise.all(
    restaurants.slice(0, 15).map(async (restaurant) => ({
      restaurant,
      route: await fetchRestaurantDrivingRoute(origin, restaurant.center, accessToken),
    })),
  );
  const nearestCandidate = routeCandidates.sort(
    (first, second) =>
      (first.route?.distance ?? first.restaurant.distanceMeters) -
      (second.route?.distance ?? second.restaurant.distanceMeters),
  )[0];
  const nearestRestaurant = nearestCandidate.restaurant;
  const route = nearestCandidate.route;
  const routeGeometry =
    route?.geometry ?? createFallbackRoute(origin, nearestRestaurant.center);
  const routeDistance = route?.distance ?? nearestRestaurant.distanceMeters;

  markerRefs.restaurant.current = [
    drawNearestRestaurantRoute(map, origin, nearestRestaurant, routeGeometry),
  ];
  setStatus(`Тантай хамгийн ойр хоолны газар ${formatDistance(routeDistance)} зайд байна.`);
};

export const findNearestTireRepair = async ({
  accessToken,
  map,
  markerRefs,
  origin,
  setStatus,
}: SearchContext) => {
  setStatus("Таны ойролцоох дугуй засварыг хайж байна...");

  const tireRepairs = await fetchNearbyTireRepairs(origin, 5000, accessToken);
  clearAllRoutes(map, markerRefs);

  if (tireRepairs.length === 0) {
    setStatus("5 км-ийн хүрээнд ойролцоох дугуй засвар олдсонгүй.");
    return;
  }

  setStatus(`${tireRepairs.length} дугуй засвар олдлоо. Замуудыг шалгаж байна...`);

  const routeCandidates = await Promise.all(
    tireRepairs.slice(0, 15).map(async (place) => ({
      place,
      route: await fetchTireRepairDrivingRoute(origin, place.center, accessToken),
    })),
  );
  const nearestCandidate = routeCandidates.sort(
    (first, second) =>
      (first.route?.distance ?? first.place.distanceMeters) -
      (second.route?.distance ?? second.place.distanceMeters),
  )[0];
  const nearestPlace = nearestCandidate.place;
  const route = nearestCandidate.route;
  const routeGeometry = route?.geometry ?? createFallbackRoute(origin, nearestPlace.center);
  const routeDistance = route?.distance ?? nearestPlace.distanceMeters;

  markerRefs.tireRepair.current = [
    drawNearestTireRepairRoute(map, origin, nearestPlace, routeGeometry),
  ];
  setStatus(`Тантай хамгийн ойр дугуй засвар ${formatDistance(routeDistance)} зайд байна.`);
};

const createFallbackRoute = (
  origin: Coordinate,
  destination: Coordinate,
): RouteLineGeometry => ({
  type: "LineString",
  coordinates: [origin, destination],
});
