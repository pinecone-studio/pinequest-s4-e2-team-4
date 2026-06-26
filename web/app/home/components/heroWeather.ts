import type { WeatherType } from "./heroTypes";

export function getWeatherType(code: number): WeatherType {
  if (code === 0) return "sun";
  if (code === 1 || code === 2 || code === 3) return "cloud";
  if (code >= 45 && code <= 48) return "cloud";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 86) return "rain";
  if (code >= 80 && code <= 82) return "rain";
  if (code === 95 || code === 96 || code === 99) return "wind";
  return "sun";
}
