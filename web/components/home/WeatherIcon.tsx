type WeatherIconProps = {
  type: "sun" | "heat" | "cloud" | "rain" | "wind";
};

export default function WeatherIcon({
  type,
}: WeatherIconProps) {
  if (type === "cloud") {
    return <span className="weather-cloud" />;
  }

  if (type === "rain") {
    return (
      <span className="weather-rain">
        <i />
        <b />
      </span>
    );
  }

  if (type === "wind") {
    return (
      <span className="weather-wind">
        <i />
        <b />
      </span>
    );
  }

  return (
    <span
      className={
        type === "heat"
          ? "weather-sun heat"
          : "weather-sun"
      }
    />
  );
}
function getWeatherIcon(
  code: number
): "sun" | "cloud" | "rain" | "wind" | "heat" {
  if (code === 0) return "sun";

  if ([1, 2, 3].includes(code)) {
    return "cloud";
  }

  if (
    [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)
  ) {
    return "rain";
  }

  if ([95, 96, 99].includes(code)) {
    return "wind";
  }

  return "cloud";
}