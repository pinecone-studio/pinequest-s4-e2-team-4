"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ListChecks } from "lucide-react";
import { imageFor } from "./presentationData";
import { SlideShell } from "./slideComponents";
import type { PresentationSlide } from "./types";

export function ContentsSlide({
  contentSlides,
  onSelect,
}: {
  contentSlides: PresentationSlide[];
  onSelect: (slideIndex: number) => void;
}) {
  return (
    <SlideShell>
      <div className="relative grid h-full grid-cols-[0.9fr_1.1fr] gap-10 overflow-hidden px-16 py-12">
        <div className="absolute right-0 top-0 h-full w-[42%] opacity-25">
          <Image src={imageFor.cover} alt="Mongolian landscape texture" fill className="object-cover" sizes="40vw" />
        </div>
        <div className="relative z-10 flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold uppercase text-[#51631f]"
          >
            MonTrip deck
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-7xl font-black uppercase leading-none text-[#708139]"
          >
            Агуулга
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-7 max-w-md text-2xl font-semibold leading-snug text-[#26331d]"
          >
            Title дээр дарахад тухайн slide бүтнээрээ animation-той нээгдэнэ.
          </motion.p>
        </div>

        <div className="relative z-10 grid content-center gap-3">
          {contentSlides.map((slide, index) => {
            const Icon = slide.icon ?? ListChecks;

            return (
              <motion.button
                key={slide.id}
                type="button"
                initial={{ opacity: 0, x: 38 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.14 + index * 0.07, duration: 0.45 }}
                onClick={() => onSelect(index + 2)}
                className="group flex h-16 items-center justify-between rounded-full border border-[#d8ddc9] bg-white/85 px-4 text-left text-[#26331d] shadow-sm transition hover:-translate-y-0.5 hover:border-[#708139] hover:bg-white hover:shadow-[0_16px_36px_rgba(31,43,34,0.16)]"
              >
                <span className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[#edf3df] text-[#708139] transition group-hover:bg-[#708139] group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-xs font-black uppercase text-[#708139]">Slide {index + 3}</span>
                    <span className="block text-2xl font-black uppercase leading-none">{slide.title}</span>
                  </span>
                </span>
                <ChevronRight className="h-6 w-6 text-[#708139] transition group-hover:translate-x-1" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </SlideShell>
  );
}
