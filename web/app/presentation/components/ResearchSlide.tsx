"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import { imageFor, research } from "./presentationData";
import { Gauge, SlideShell, SlideTitle } from "./slideComponents";

export function ResearchSlide() {
  return (
    <SlideShell>
      <div className="absolute right-0 top-0 h-full w-[45%] overflow-hidden rounded-l-[48%] shadow-[-18px_0_40px_rgba(31,43,34,0.28)]">
        <Image src={imageFor.road} alt="Open road" fill className="object-cover" sizes="45vw" />
      </div>
      <div className="relative z-10 h-full w-[62%] px-16 py-12">
        <SlideTitle>Судалгаа</SlideTitle>
        <div className="mt-3 flex items-center gap-3 text-xl font-semibold text-[#51631f]">
          <Users className="h-8 w-8" />
          30+ хүнээс авсан судалгаа
        </div>
        <div className="mt-9 grid grid-cols-2 gap-x-12 gap-y-10">
          {research.map((item, index) => (
            <Gauge key={item.label} {...item} index={index} />
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
