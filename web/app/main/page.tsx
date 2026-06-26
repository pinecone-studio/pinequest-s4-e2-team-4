"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import PhoneFrame from "@/components/home/PhoneFrame";
import MainIntroScreen from "./components/MainIntroScreen";
import type { MainScreen } from "./components/mainTypes";

export default function MainPage() {
  const [screen, setScreen] = useState<MainScreen>("intro");
  const router = useRouter();

  const startTrip = () => {
    setScreen("zooming");
    window.setTimeout(() => router.push("/home"), 1450);
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-8 text-slate-950">
      <HomeBackdrop active={screen !== "intro"} />
      <div className="relative z-10">
        <PhoneFrame>
          <MainIntroScreen screen={screen} onStart={startTrip} />
        </PhoneFrame>
      </div>
    </main>
  );
}
