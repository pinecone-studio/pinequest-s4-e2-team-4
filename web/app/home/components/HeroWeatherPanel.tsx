import WeatherIcon from "@/components/home/WeatherIcon";
import type { Forecast } from "./heroTypes";
import { getWeatherType } from "./heroWeather";

type HeroWeatherPanelProps = {
  forecast: Forecast | null;
};

export default function HeroWeatherPanel({ forecast }: HeroWeatherPanelProps) {
  const todayCode = forecast?.daily?.weathercode?.[0] ?? 0;
  const todayTemperature = forecast?.daily?.temperature_2m_max?.[0];

  return (
    <>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Цаг агаар</h2>
        </div>
        <div className="rounded-3xl bg-[#ebeaea] p-5 shadow-lg">
          <div className="flex items-center gap-9">
            <WeatherIcon type={getWeatherType(todayCode)} />
            <div>
              <p className="text-sm text-slate-500">Өнөөдөр</p>
              <p className="text-3xl font-black">
                {todayTemperature === undefined ? "--" : Math.round(todayTemperature)}°
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-[#0b7f71] p-5 text-white shadow-xl">
        <h2 className="mb-4 text-lg font-bold">7 хоногийн төлөв</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {forecast?.daily?.time?.map((date, index) => (
            <div
              key={date}
              className="w-16 flex-shrink-0 rounded-2xl bg-white/14 px-2 py-3 text-center"
            >
              <p className="text-xs font-bold">
                {new Date(date).toLocaleDateString("mn-MN", { weekday: "short" })}
              </p>
              <div className="my-3 flex justify-center">
                <WeatherIcon type={getWeatherType(forecast.daily?.weathercode?.[index] ?? 0)} />
              </div>
              <p className="text-sm font-black">
                {Math.round(forecast.daily?.temperature_2m_max?.[index] ?? 0)}°
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
