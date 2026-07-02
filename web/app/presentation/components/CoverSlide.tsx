"use client";

import { motion } from "framer-motion";
import { imageFor } from "./presentationData";
import { PhotoPanel, SlideShell } from "./slideComponents";

export function CoverSlide() {
  return (
    <SlideShell>
      <div className="absolute left-16 top-14 text-xl font-medium uppercase text-[#718143]">Team</div>
      <div className="absolute right-16 top-14 text-xl font-medium uppercase text-[#718143]">Astra</div>
      <div className="flex h-full flex-col items-center justify-center px-16 pb-12 pt-24">
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="z-10 text-8xl font-black leading-none text-[#718143] md:text-[9rem]"
        >
          MonTriP
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="z-10 mb-[-8px] mt-3 text-center text-2xl font-black uppercase text-[#51631f]"
        >
          Монголд аялах хамгийн тохиромжтой газрыг AI санал болгоно
        </motion.p>
        <PhotoPanel src={imageFor.cover} alt="Mongolian landscape" priority className="h-[42%] w-full" />
      </div>
    </SlideShell>
  );
}
