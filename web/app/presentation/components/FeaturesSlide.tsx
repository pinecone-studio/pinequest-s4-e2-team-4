"use client";

import { motion } from "framer-motion";
import { imageFor } from "./presentationData";
import { PhotoPanel, SlideShell, SlideTitle } from "./slideComponents";

export function FeaturesSlide() {
  return (
    <SlideShell>
      <div className="grid h-full grid-cols-[0.95fr_1fr] gap-12 px-16 py-12">
        <div className="flex flex-col justify-center">
          <SlideTitle>Онцлогууд</SlideTitle>
          <div className="mt-16 space-y-12">
            {["Төсөвт тохирсон санал", "Маршрут санал болгох", "Хэрэглэгчид тохирсон аялал"].map(
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.14 + index * 0.12 }}
                  className="flex items-start gap-5 text-3xl font-black uppercase leading-tight text-[#718143]"
                >
                  <span className="mt-2 text-4xl leading-none">•</span>
                  <span>{item}</span>
                </motion.div>
              )
            )}
          </div>
        </div>
        <PhotoPanel src={imageFor.statue} alt="Chinggis Khaan statue" className="h-full w-full" />
      </div>
    </SlideShell>
  );
}
