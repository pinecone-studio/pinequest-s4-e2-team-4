"use client";

import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import HeroChecklistDrawerContent from "./HeroChecklistDrawerContent";

type HeroChecklistDrawerProps = {
  onClose: () => void;
};

export default function HeroChecklistDrawer({
  onClose,
}: HeroChecklistDrawerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(onClose, 260);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDrawer]);

  return (
    <div className="absolute inset-0 z-50 overflow-hidden">
      <button
        type="button"
        aria-label="Жагсаалт хаах"
        onClick={closeDrawer}
        className={`absolute inset-0 bg-slate-950/20 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex w-full flex-col bg-[#fbfbff] shadow-2xl transition-transform duration-300 ease-out ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-center gap-4 border-b border-gray-100 bg-white px-5 pb-4 pt-14">
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-bold text-[#0F2942]">Авч явах зүйлс</h1>
        </header>

        <HeroChecklistDrawerContent />
      </aside>
    </div>
  );
}
