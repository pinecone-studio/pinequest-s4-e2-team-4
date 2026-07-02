"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createPresentationSlides } from "./components/slides";

export default function PresentationPage() {
  const [active, setActive] = useState(0);
  const lastWheelAt = useRef(0);

  const slides = useMemo(() => createPresentationSlides(setActive), []);
  const currentSlide = slides[active];

  const go = useCallback(
    (direction: number) => {
      setActive((current) => {
        if (current === 0 && direction > 0) return 1;
        if (current === 1 && direction < 0) return 0;
        if (current === 1 && direction > 0) return 1;
        if (current > 1 && direction < 0) return 1;

        return Math.min(current + direction, slides.length - 1);
      });
    },
    [slides.length]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  const handleWheel = useCallback(
    (event: React.WheelEvent<HTMLElement>) => {
      const now = Date.now();

      if (Math.abs(event.deltaY) < 28 || now - lastWheelAt.current < 720) {
        return;
      }

      lastWheelAt.current = now;
      go(event.deltaY > 0 ? 1 : -1);
    },
    [go]
  );

  return (
    <main onWheel={handleWheel} className="min-h-screen overflow-hidden bg-[#172315] px-5 py-6 text-white md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-7xl flex-col gap-4">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-[#cfd9b4]">MonTrip presentation</p>
            <h1 className="text-2xl font-black text-white">{currentSlide.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="min-w-20 text-center text-lg font-bold text-[#e8ecd9]">
              {active + 1}/{slides.length}
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </header>

        <div className="grid flex-1 place-items-center">
          <div className="w-full max-w-6xl">
            <div className="aspect-video w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide.id}
                  className="h-full w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  {currentSlide.render()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <footer className="flex min-h-16 items-center justify-center pb-1">
          {active === 0 && (
            <p className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white/80">
              Scroll down эсвэл next дарж агуулга руу орно
            </p>
          )}

          {active === 1 && (
            <p className="rounded-full border border-[#d9e7aa]/30 bg-[#d9e7aa]/10 px-5 py-3 text-sm font-semibold text-[#d9e7aa]">
              Title сонгоод тухайн slide-ийг бүтнээр нь нээнэ
            </p>
          )}

          {active > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActive(1)}
                className="h-12 rounded-full border border-[#d9e7aa]/40 bg-[#d9e7aa] px-6 text-base font-black text-[#172315] transition hover:bg-white"
              >
                Агуулга руу буцах
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={active === slides.length - 1}
                className="h-12 rounded-full border border-white/15 bg-white/10 px-6 text-base font-bold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Дараагийн slide
              </button>
            </div>
          )}
        </footer>
      </div>
    </main>
  );
}
