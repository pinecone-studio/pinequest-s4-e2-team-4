import WeatherIcon from "@/components/home/WeatherIcon";
import type { Forecast } from "./heroTypes";
import { getWeatherType } from "./heroWeather";
import { useLanguage } from "@/app/lib/language";

type HeroWeatherPanelProps = {
  forecast: Forecast | null;
};

export default function HeroWeatherPanel({ forecast }: HeroWeatherPanelProps) {
  const { language } = useLanguage();
  const t =
    language === "en"
      ? { label: "Weather", today: "Today" }
      : { label: "Цаг агаар", today: "Өнөөдөр" };
  const todayCode = forecast?.daily?.weathercode?.[0] ?? 0;
  const todayTemperature = forecast?.daily?.temperature_2m_max?.[0];

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[#0A4429] p-5 shadow-lg shadow-emerald-900/20 transition-all hover:shadow-emerald-900/30">

      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-700/50 blur-2xl" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <WeatherIcon type={getWeatherType(todayCode)} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200/80 mb-0.5">
              {t.label}
            </p>
            <h2 className="text-base font-black text-white">{t.today}</h2>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-black text-white tracking-tighter">
            {todayTemperature === undefined ? "--" : Math.round(todayTemperature)}°
          </p>
          <p className="text-[10px] text-emerald-200/60 font-bold">Ulaanbaatar</p>
        </div>
      </div>
    </section>
  );
}
