"use client";

import Image from "next/image";
import { useState } from "react";
import HomeBackdrop from "./HomeBackdrop";
import Logo from "./Logo";
import PhoneFrame from "./PhoneFrame";



type AppScreen = "intro" | "zooming" | "home";

export default function TravelApp() {
  const [screen, setScreen] = useState<AppScreen>("intro");
  const startTrip = () => {
    setScreen("zooming");
    window.setTimeout(() => setScreen("home"), 1450);
  };

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
          <header className="flex items-center justify-between border-b border-slate-200 px-5 pb-4 pt-14">
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
                <h2 className="text-lg font-bold">Байршлын цаг агаар</h2>
                <span className="text-sm font-semibold text-[#0b7f71]">7 хоног →</span>
              </div>
           
            </section>
            
          </div>
        </section>
      )}
        </PhoneFrame>
      </div>
    </main>
  );
}
