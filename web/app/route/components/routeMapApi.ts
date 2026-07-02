import type {
  Coordinate,
  DirectionsRoute,
  GasStation,
  MapboxPlaceFeature,
  MapboxTilequeryFeature,
  OverpassElement,
} from "./routeMap.types";
import { getDistanceMeters } from "./routeMapUtils";



interface DestinationItem {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  order: number;
}


export async function fetchTripDestinations(tripId: string): Promise<DestinationItem[]> {
  const res = await fetch(`/api/trips/${tripId}`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Аяллын өгөгдлийг баазаас татаж чадсангүй.");
  }
  const data = await res.json();
  return data.destinations;
}


export async function fetchRouteCoordinates(destinations: DestinationItem[]): Promise<Coordinate[]> {
  const res = await fetch("/api/trips/marshrut", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destinations }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Маршрутын замыг тооцоолж чадсангүй.");
  }

  const data = await res.json();
  return data.coordinates; // [[lng, lat], [lng, lat], ...]
}



export const fetchNearbyGasStations = async (
  origin: Coordinate,
  radiusMeters = 7000,
  accessToken?: string,
) => {
  const [overpassStations, mapboxStations, mapboxTileStations] = await Promise.all([
    fetchOverpassGasStations(origin, radiusMeters).catch(() => []),
    accessToken ? fetchMapboxGasStations(origin, accessToken).catch(() => []) : [],
    accessToken ? fetchMapboxTilequeryGasStations(origin, radiusMeters, accessToken).catch(() => []) : [],
  ]);

  return dedupeGasStations([...mapboxTileStations, ...overpassStations, ...mapboxStations]).sort(
    (first, second) => first.distanceMeters - second.distanceMeters,
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

const fetchOverpassGasStations = async (
  [longitude, latitude]: Coordinate,
  radiusMeters: number,
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

const fetchMapboxGasStations = async (
  origin: Coordinate,
  accessToken: string,
) => {
  const [longitude, latitude] = origin;
  const queries = ["gas station", "petrol station", "fuel station"];
  const responses = await Promise.all(
    queries.map((query) => {
      const params = new URLSearchParams({
        access_token: accessToken,
        proximity: `${longitude},${latitude}`,
        types: "poi",
        limit: "10",
        language: "en",
      });

      return fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params.toString()}`,
      );
    }),
  );const payloads = await Promise.all(
    responses.filter((response) => response.ok).map((response) => response.json()),
  );
  const features = payloads.flatMap(
    (payload: { features?: MapboxPlaceFeature[] }) => payload.features ?? [],
  );

  return features
    .map((feature) => toMapboxGasStation(feature, origin))
    .filter((station): station is GasStation => station !== null);
};

const fetchMapboxTilequeryGasStations = async (
  origin: Coordinate,
  radiusMeters: number,
  accessToken: string,
) => {
  const [longitude, latitude] = origin;
  const params = new URLSearchParams({
    access_token: accessToken,
    layers: "poi_label",
    radius: String(Math.min(radiusMeters, 10000)),
    limit: "50",
  });
  const response = await fetch(
    `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/${longitude},${latitude}.json?${params.toString()}`,
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as { features?: MapboxTilequeryFeature[] };

  return (
    data.features
      ?.filter(isFuelTilequeryFeature)
      .map((feature) => toTilequeryGasStation(feature, origin))
      .filter((station): station is GasStation => station !== null) ?? []
  );
};

const toGasStation = (element: OverpassElement, origin: Coordinate): GasStation | null => {
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;

  if (lat === undefined || lon === undefined) {
    return null;
  }

  return {
    id: `osm-${element.id}`,
    name: element.tags?.name ?? element.tags?.brand ?? element.tags?.operator ?? "Gas station",
    address: element.tags?.["addr:street"],
    center: [lon, lat],
    distanceMeters: getDistanceMeters(origin, [lon, lat]),
  };
};

const toMapboxGasStation = (
  feature: MapboxPlaceFeature,
  origin: Coordinate,
): GasStation | null => {
  if (!feature.center) {
    return null;
  }

  return {
    id: `mapbox-${feature.id}`,
    name: feature.text ?? "Gas station",
    address: feature.place_name,
    center: feature.center,
    distanceMeters: getDistanceMeters(origin, feature.center),
  };
};

const toTilequeryGasStation = (
  feature: MapboxTilequeryFeature,
  origin: Coordinate,
): GasStation | null => {
  const center = feature.geometry?.coordinates;

  if (!center) {
    return null;
  }

  return {
    id: `tile-${feature.id ?? center.join(",")}`,
    name: feature.properties?.name ?? "Gas station",
    center,
    distanceMeters: getDistanceMeters(origin, center),
  };
};

const isFuelTilequeryFeature = (feature: MapboxTilequeryFeature) => {
  const properties = feature.properties;
  const label = [
    properties?.name,
    properties?.maki,
    properties?.class,
    properties?.type,
    properties?.category_en,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    properties?.maki === "fuel" ||
    label.includes("fuel") ||
    label.includes("gas") ||
    label.includes("petrol")
  );
};

const dedupeGasStations = (stations: GasStation[]) => {
  const uniqueStations: GasStation[] = [];

  stations.forEach((station) => {
    const duplicate = uniqueStations.some(
      (existingStation) => getDistanceMeters(existingStation.center, station.center) < 80,
    );

    if (!duplicate) {
      uniqueStations.push(station);
    }
  });

  return uniqueStations;  
};