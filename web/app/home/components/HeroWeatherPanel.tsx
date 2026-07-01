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
      <section className="overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe]/50 to-white py-2.5 px-4 shadow-md shadow-sky-950/5">
        <div className="flex items-center justify-between gap-2">
 
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[1rem] bg-white shadow-sm ring-1 ring-sky-100">
              <WeatherIcon type={getWeatherType(todayCode)} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#04530c] leading-none mb-0.5">
                Цаг агаар
              </p>
              <h2 className="text-sm font-black text-slate-950 leading-none">Өнөөдөр</h2>
            </div>
          </div>

          <div>
            <p className="text-3xl font-black text-slate-950 tracking-tighter">
              {todayTemperature === undefined ? "--" : Math.round(todayTemperature)}°
            </p>
          </div>
        </div>
      </section>
    </>
  );
}