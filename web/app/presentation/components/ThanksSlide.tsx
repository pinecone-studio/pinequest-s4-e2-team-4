"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { imageFor } from "./presentationData";
import { SlideShell } from "./slideComponents";

export function ThanksSlide() {
  return (
    <SlideShell>
      <Image src={imageFor.cover} alt="Mongolian landscape" fill className="object-cover" sizes="90vw" />
      <div className="absolute inset-0 bg-[#f5f1e9]/70" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-8xl font-black text-[#718143]"
        >
          Баярлалаа
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 max-w-3xl text-3xl font-semibold text-[#26331d]"
        >
          MonTrip таны аяллыг хурдан, ухаалаг, өөрт тохирсон байдлаар төлөвлөнө.
        </motion.p>
      </div>
    </SlideShell>
  );
}
