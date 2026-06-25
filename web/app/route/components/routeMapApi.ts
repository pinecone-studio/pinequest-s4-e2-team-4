import type { Coordinate, DirectionsRoute, GasStation, OverpassElement } from "./routeMap.types";
import { getDistanceMeters } from "./routeMapUtils";

export const fetchNearbyGasStations = async (
  [longitude, latitude]: Coordinate,
  radiusMeters = 7000,
) => {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="fuel"](around:${radiusMeters},${latitude},${longitude});
      way["amenity"="fuel"](around:${radiusMeters},${latitude},${longitude});
      relation["amenity"="fuel"](around:${radiusMeters},${latitude},${longitude});
    );
    out center 25;
  `;
  const response = await fetch(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
  );

  if (!response.ok) {
    throw new Error("Gas station search failed.");
  }

  const data = (await response.json()) as { elements?: OverpassElement[] };

  return (
    data.elements
      ?.map((element) => toGasStation(element, [longitude, latitude]))
      .filter((station): station is GasStation => station !== null) ?? []
  );
};

export const fetchDrivingRoute = async (
  origin: Coordinate,
  destination: Coordinate,
  accessToken: string,
) => {
  const params = new URLSearchParams({
    access_token: accessToken,
    geometries: "geojson",
    overview: "full",
    steps: "false",
  });
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?${params.toString()}`,
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { routes?: DirectionsRoute[] };
  return data.routes?.[0] ?? null;
};

const toGasStation = (element: OverpassElement, origin: Coordinate): GasStation | null => {
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;

  if (lat === undefined || lon === undefined) {
    return null;
  }

  return {
    id: element.id,
    name: element.tags?.name ?? element.tags?.brand ?? element.tags?.operator ?? "Gas station",
    address: element.tags?.["addr:street"],
    center: [lon, lat],
    distanceMeters: getDistanceMeters(origin, [lon, lat]),
  };
};
