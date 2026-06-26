export type Coordinate = [number, number];

export type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
    brand?: string;
    operator?: string;
    "addr:street"?: string;
  };
};

export type GasStation = {
  id: string;
  name: string;
  address?: string;
  center: Coordinate;
  distanceMeters: number;
};

export type MapboxPlaceFeature = {
  id: string;
  text?: string;
  place_name?: string;
  center?: Coordinate;
  properties?: {
    category?: string;
  };
};

export type MapboxTilequeryFeature = {
  id?: string | number;
  geometry?: {
    type?: string;
    coordinates?: Coordinate;
  };
  properties?: {
    name?: string;
    maki?: string;
    class?: string;
    type?: string;
    category_en?: string;
  };
};

export type RouteLineGeometry = {
  type: "LineString";
  coordinates: Coordinate[];
};

export type DirectionsRoute = {
  distance: number;
  duration: number;
  geometry: RouteLineGeometry;
};
