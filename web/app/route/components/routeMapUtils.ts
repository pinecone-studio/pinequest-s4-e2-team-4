import type { Coordinate } from "./routeMap.types";

export const fallbackPoint = [106.9176, 47.9188] as Coordinate;
export const gasRouteSourceId = "nearest-gas-route";
export const gasRouteLayerId = "nearest-gas-route";
export const locationAccuracySourceId = "location-accuracy";

export const formatDistance = (meters: number) => {
  if (meters < 1000) {
    return `${Math.round(meters)} метр`;
  }

  return `${(meters / 1000).toFixed(1)} км`;
};

export const getDistanceMeters = (
  [fromLongitude, fromLatitude]: Coordinate,
  [toLongitude, toLatitude]: Coordinate,
) => {
  const earthRadiusMeters = 6371000;
  const toRadians = (degree: number) => (degree * Math.PI) / 180;
  const latitudeDelta = toRadians(toLatitude - fromLatitude);
  const longitudeDelta = toRadians(toLongitude - fromLongitude);
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(fromLatitude)) *
      Math.cos(toRadians(toLatitude)) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
