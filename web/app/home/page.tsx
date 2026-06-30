"use client";

import { useState, useEffect, type ReactNode } from "react";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import HomeFooter from "@/components/home/Footer";
import Logo from "@/components/home/Logo";
import PhoneFrame from "@/components/home/PhoneFrame";
// import HeroTripCard from "./components/HeroTripCard";
import HeroChecklistCard from "./components/HeroChecklistCard";
import HeroWeatherPanel from "./components/HeroWeatherPanel";
import HeroSearchSection from "./components/HeroSearchSection"; 
import { useHeroForecast } from "./components/useHeroForecast";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

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
      <section className="flex h-full flex-col bg-[#fbfbff]">
        {children}
      </section>
    </PhoneFrame>
  );
}

function HeroHeader() {
  const [currentLang, setCurrentLang] = useState("MN");
  const [isOpen, setIsOpen] = useState(false);
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

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectLanguage = (lang: string) => {
    setCurrentLang(lang);
    setIsOpen(false);
  };

  return (
    <header className="relative flex items-center justify-between px-5 pb-2 pt-12">
      <div className="relative z-50 w-16 text-left">
        <button 
          onClick={toggleDropdown}
          className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <span className="text-base select-none">{currentLang === "MN" ? "🇲🇳" : "🇬🇧"}</span>
          <span>{currentLang}</span>
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-1.5 w-24 rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
            <button
              onClick={() => selectLanguage("MN")}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold ${
                currentLang === "MN" ? "bg-[#0A4429]/10 text-[#0A4429]" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">🇲🇳</span>
              <span>MN</span>
            </button>
            <button
              onClick={() => selectLanguage("EN")}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-semibold ${
                currentLang === "EN" ? "bg-[#0A4429]/10 text-[#0A4429]" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">🇬🇧</span>
              <span>EN</span>
            </button>
          </div>
        )}
      </div>

      <Logo />

      <div className="w-16 text-right flex justify-end">
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

  return (
    <>
      <HeroHeader />

      <HeroSearchSection />

      <HeroScrollArea>
        <HeroChecklistCard />
        <HeroWeatherPanel forecast={forecast} />
      </HeroScrollArea>

      <HeroFooterBar />
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
