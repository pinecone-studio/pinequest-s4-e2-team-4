"use client";

import { motion } from "framer-motion";
import { team } from "./presentationData";
import { SlideShell, SlideTitle } from "./slideComponents";

export function TeamSlide() {
  return (
    <SlideShell>
      <div className="h-full px-14 py-12">
        <SlideTitle>Манай баг</SlideTitle>
        <div className="mt-6 grid h-[76%] grid-cols-4 gap-x-8 gap-y-7">
          {team.map((name, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.08 + index * 0.08, duration: 0.55 }}
              className={`${index === 0 ? "col-span-2 row-span-2 self-center justify-self-center" : ""} flex flex-col items-center`}
            >
              <div
                className={`${index === 0 ? "h-52 w-52" : "h-40 w-40"} grid place-items-center bg-[#1b251c] shadow-[0_18px_36px_rgba(31,43,34,0.2)]`}
                style={{ clipPath: "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)" }}
              >
                <div className="grid h-[72%] w-[72%] place-items-center rounded-full bg-[#f7f4ed] text-4xl font-black text-[#233c2b]">
                  {name.split(" ").at(-1)?.slice(0, 1)}
                </div>
              </div>
              <div className="mt-2 border-y-4 border-[#718143] px-7 py-1 text-xl font-black text-[#51631f]">
                {name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
