"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { imageFor, problems } from "./presentationData";
import { IconBadge, SlideShell, SlideTitle } from "./slideComponents";

export function ProblemSlide() {
  return (
    <SlideShell tone="photo">
      <Image src={imageFor.plains} alt="Mongolian grassland" fill className="object-cover" sizes="90vw" />
      <div className="absolute inset-0 bg-[#23380f]/55" />
      <div className="relative z-10 grid h-full grid-cols-[0.92fr_1fr] items-center gap-12 px-20">
        <SlideTitle light>Асуудал</SlideTitle>
        <div className="space-y-8">
          {problems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 42 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + index * 0.12 }}
              className="flex items-center gap-7"
            >
              <IconBadge icon={item.icon} />
              <p className="text-3xl font-black uppercase leading-tight text-white">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
