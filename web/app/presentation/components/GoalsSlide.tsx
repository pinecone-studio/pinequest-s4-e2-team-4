"use client";

import { motion } from "framer-motion";
import { goalItems, imageFor } from "./presentationData";
import { PhotoPanel, SlideShell, SlideTitle } from "./slideComponents";

export function GoalsSlide() {
  return (
    <SlideShell>
      <div className="grid h-full grid-cols-[1.08fr_0.92fr] gap-14 px-16 py-12">
        <div>
          <SlideTitle>Зорилго</SlideTitle>
          <div className="mt-14 grid grid-cols-2 gap-x-14 gap-y-16">
            {goalItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + index * 0.12 }}
                className="relative flex h-24 items-center rounded-full bg-[#49630b] pl-20 pr-6 text-2xl font-black uppercase leading-tight text-white"
              >
                <div className="absolute -left-6 grid h-28 w-28 place-items-center rounded-full border-4 border-white bg-white shadow-md">
                  <item.icon className="h-16 w-16" style={{ color: item.tone }} fill={item.tone} />
                </div>
                {item.label}
              </motion.div>
            ))}
          </div>
        </div>
        <PhotoPanel src={imageFor.camp} alt="Camping sunset" className="h-full w-full" />
      </div>
    </SlideShell>
  );
}
