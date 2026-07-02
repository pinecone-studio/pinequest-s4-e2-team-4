"use client";

import { useState, type ReactNode } from "react";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import HomeFooter from "@/components/home/Footer";
import Logo from "@/components/home/Logo";
import PhoneFrame from "@/components/home/PhoneFrame";
import HeroChecklistCard from "./components/HeroChecklistCard";
import HeroChecklistDrawer from "./components/HeroChecklistDrawer";
import HeroWeatherPanel from "./components/HeroWeatherPanel";
import HeroSearchSection from "./components/HeroSearchSection"; 
import HeroNotificationButton from "./components/HeroNotificationButton";
import { useHeroForecast } from "./components/useHeroForecast";
import Image from "next/image";

type HeroPageShellProps = {
  children: ReactNode;
};

type HeroPhoneLayoutProps = {
  children: ReactNode;
};

type HeroScrollAreaProps = {
  children: ReactNode;
};

function HeroPageShell({ children }: HeroPageShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden text-slate-950">
      <HomeBackdrop active={true} />
      <div className="relative z-10">{children}</div>
    </main>
  );
}

function HeroPhoneLayout({ children }: HeroPhoneLayoutProps) {
  return (
    <PhoneFrame>
      <section className="relative flex h-full flex-col overflow-hidden bg-[#fbfbff]">
        {children}
      </section>
    </PhoneFrame>
  );
}

function HeroHeader() {
  return (
    <header className="relative flex items-center  px-5 pb-2 pt-12">
      <div className="flex  gap-1">
        <Image
          src="/montrip.png"
          alt="montrip logo"
          width={45}
          height={45}
          className="rounded-2xl"
        />
        <Logo />
      </div>

    </header>
  );
}

function HeroScrollArea({ children }: HeroScrollAreaProps) {
  return (
    <div className="scrollbar-invisible min-h-0 flex-1 overflow-y-auto">
      <div className="space-y-5 px-5 py-4">{children}</div>
    </div>
  );
}

function HeroFooterBar() {
  return (
    <div className="shrink-0">
      <HomeFooter />
    </div>
  );
}

function HeroContent() {
  const forecast = useHeroForecast();
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  return (
    <>
      <HeroHeader />
      <HeroNotificationButton onOpenChecklist={() => setIsChecklistOpen(true)} />

      <HeroSearchSection />

      <HeroScrollArea>
        <HeroWeatherPanel forecast={forecast} />
        <HeroChecklistCard onOpenChecklist={() => setIsChecklistOpen(true)} />
      </HeroScrollArea>

      <HeroFooterBar />

      {isChecklistOpen && (
        <HeroChecklistDrawer onClose={() => setIsChecklistOpen(false)} />
      )}
    </>
  );
}

export default function HeroPage() {
  return (
    <HeroPageShell>
      <HeroPhoneLayout>
        <HeroContent />
      </HeroPhoneLayout>
    </HeroPageShell>
  );
}
