"use client";

import { useState, useEffect, type ReactNode } from "react";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import HomeFooter from "@/components/home/Footer";
import Logo from "@/components/home/Logo";
import PhoneFrame from "@/components/home/PhoneFrame";
import HeroChecklistCard from "./components/HeroChecklistCard";
import HeroChecklistDrawer from "./components/HeroChecklistDrawer";
import HeroWeatherPanel from "./components/HeroWeatherPanel";
import HeroSearchSection from "./components/HeroSearchSection"; 
import { useHeroForecast } from "./components/useHeroForecast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
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
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const count = localStorage.getItem("montrip-unread-checklist");

      if (count) {
        setUnreadCount(parseInt(count, 10));
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

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

      <div className="absolute right-5 top-14 flex justify-end">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <FontAwesomeIcon icon={faBell} className="h-4 w-4" />
          
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </button>
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
