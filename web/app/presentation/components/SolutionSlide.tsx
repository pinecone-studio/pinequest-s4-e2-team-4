"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BrainCircuit, Map, UserRound } from "lucide-react";
import { imageFor } from "./presentationData";
import { SlideShell, SlideTitle } from "./slideComponents";

export function SolutionSlide() {
  return (
    <SlideShell tone="photo">
      <Image src={imageFor.plains} alt="Mongolian plains" fill className="object-cover" sizes="90vw" />
      <div className="absolute inset-0 bg-[#23380f]/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-16 text-center">
        <SlideTitle light>Шийдэл</SlideTitle>
        <div className="mt-14 flex w-full items-center justify-center gap-8">
          {[
            { label: "Хэрэглэгч", icon: UserRound },
            { label: "AI шинжилгээ", icon: BrainCircuit },
            { label: "Тохирсон аялал", icon: Map },
          ].map((item, index) => (
            <div key={item.label} className="flex items-center gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.74 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.16, type: "spring", stiffness: 130 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="grid h-48 w-48 place-items-center rounded-full border-[10px] border-[#718143] bg-white">
                  <item.icon className="h-28 w-28 text-[#718143]" strokeWidth={2.3} />
                </div>
                <p className="text-3xl font-black uppercase text-white">{item.label}</p>
              </motion.div>
              {index < 2 && <div className="mb-20 text-5xl font-black text-white">→</div>}
            </div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mt-10 text-3xl font-black uppercase text-[#ffe769]"
        >
          Хурдан, хялбар, цаг хэмнэнэ
        </motion.p>
        <p className="mt-1 text-2xl text-white">Аяллаа хялбархан төлөвлө!</p>
      </div>
    </SlideShell>
  );
}
