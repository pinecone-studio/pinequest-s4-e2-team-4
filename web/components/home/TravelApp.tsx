"use client";

import Image from "next/image";

import { useState, useEffect } from "react";
import HomeBackdrop from "./HomeBackdrop";
import Logo from "./Logo";
import PhoneFrame from "./PhoneFrame";
import HomeFooter from "./Footer";
import WeatherIcon from "./WeatherIcon";

type AppScreen = "intro" | "zooming" | "home";
type WeatherType = "sun" | "cloud" | "rain" | "wind";

function getWeatherType(code: number): WeatherType {
  if (code === 0) return "sun";
  if (code === 1 || code === 2 || code === 3) return "cloud";
  if (code >= 45 && code <= 48) return "cloud";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 86) return "rain";
  if (code >= 80 && code <= 82) return "rain";
  if (code === 95 || code === 96 || code === 99) return "wind";
  return "sun";
}
export default function TravelApp() {
  const [screen, setScreen] = useState<AppScreen>("intro");
  const startTrip = () => {
    setScreen("zooming");
    window.setTimeout(() => setScreen("home"), 1450);
  };
const [forecast, setForecast] = useState<any>(null);

useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

     const res = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
);

      const data = await res.json();
      setForecast(data);
    },
    (error) => console.log(error)
  );
}, []);
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-8 text-slate-950">
      <HomeBackdrop active={screen !== "intro"} />
      <div className="relative z-10">
        <PhoneFrame>
        {screen !== "home" ? (
        <section className="relative flex h-full items-end justify-center overflow-hidden px-5 pb-14 pt-16">
          <Image
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
            alt="Mongolia nature lake and mountains"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/75" />
          <div className="relative flex w-full max-w-sm flex-col items-center gap-8 text-center text-white">
            <Logo large wordClassName={screen === "zooming" ? "intro-word-forward" : ""} />
            <div className={`space-y-4 ${screen === "zooming" ? "intro-fade-away" : ""}`}>
              <h1 className="text-4xl font-black leading-tight">Аяллаа амархан төлөвлө</h1>
              <p className="rounded-2xl bg-white/18 px-5 py-4 text-base leading-7 shadow-xl backdrop-blur-md">
Монголд аялах хамгийн тохиромжтой газрыг AI санал болгоно 
              </p>
            </div>
            <button
              onClick={startTrip}
              disabled={screen === "zooming"}
              className={`mb-2 h-14 w-56 rounded-full bg-[#0b7f71] text-lg font-bold text-white shadow-2xl transition hover:scale-[1.03] hover:bg-[#096b60] ${screen === "zooming" ? "intro-fade-away" : ""}`}
            >
              Эхлэх →
            </button>
          </div>
        </section>
      ) : (
        <section className="home-enter flex h-full flex-col bg-[#fbfbff]">
          <header className="flex items-center justify-between border-b border-slate-200 px-5 pb-4 pt-8">
            <Logo />
            <div className="grid h-10 w-10 place-items-center rounded-full border-2 border-[#6ed7c9] bg-[#e9fffb] text-xl">
              ?            </div>
          </header>
          <div className="flex-1 space-y-7 overflow-y-auto px-5 py-6">
            <div className="relative h-56 overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80"
                alt="Mountain travel destination"
                fill
                sizes="(max-width: 768px) 100vw, 448px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-sm font-semibold">Шинэ аялал эхлүүлэх</p>
                <button className="mt-3 h-12 rounded-full bg-[#0b7f71] px-8 font-bold shadow-lg transition hover:scale-[1.02]">
                  ▶ Эхлэх
                </button>
              </div>
            </div>
          <section>
  <div className="mb-4 flex items-center justify-between">
    <h2 className="text-lg font-bold">
      Цаг агаар
    </h2>
  </div>

  <div className="rounded-3xl bg-[#ebeaea] p-5 shadow-lg">
    <div className="flex items-center gap-9">
<WeatherIcon
  type={getWeatherType(forecast?.daily?.weathercode?.[0] ?? 0)}
/>

      <div>
        <p className="text-sm text-slate-500">
          Өнөөдөр
        </p>

        <p className="text-3xl font-black">
          {forecast?.daily?.temperature_2m_max?.[0]}°
        </p>
      </div>
    </div>
  </div>
</section>
<section className="rounded-3xl bg-[#0b7f71] p-5 text-white shadow-xl">
  <h2 className="mb-4 text-lg font-bold">
    7 хоногийн төлөв
  </h2>

  <div className="flex gap-2 overflow-x-auto pb-2">
    {forecast?.daily?.time?.map(
      (date: string, index: number) => (
        <div
          key={date}
          className="flex-shrink-0 w-16 rounded-2xl bg-white/14 px-2 py-3 text-center"
        >
          <p className="text-xs font-bold">
            {new Date(date).toLocaleDateString(
              "mn-MN",
              { weekday: "short" }
            )}
          </p>

          <div className="my-3 flex justify-center">
            <WeatherIcon type={getWeatherType(forecast.daily.weathercode[index])} />
          </div>

          <p className="text-sm font-black">
            {Math.round(
              forecast.daily.temperature_2m_max[index]
            )}
            °
          </p>
        </div>
      )
    )}
  </div>
</section>
            
          </div>
          <HomeFooter />
        </section>
      )}
        </PhoneFrame>
      </div>
    </main>
  );
}
