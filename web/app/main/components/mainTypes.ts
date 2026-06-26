export type MainScreen = "intro" | "zooming" | "home";

export type WeatherType = "sun" | "cloud" | "rain" | "wind";

export type Forecast = {
  daily?: {
    time?: string[];
    weathercode?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
};
