"use client";

import { motion } from "framer-motion";
import { MousePointer2, Play } from "lucide-react";
import { SlideShell } from "./slideComponents";

export function DemoSlide() {
  return (
    <SlideShell>
      <div className="grid h-full place-items-center px-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="flex flex-col items-center"
        >
          <div className="mb-8 grid h-36 w-36 place-items-center rounded-full bg-[#49630b] text-white shadow-[0_20px_50px_rgba(31,43,34,0.25)]">
            <Play className="h-16 w-16 fill-white" />
          </div>
          <h2 className="text-8xl font-black uppercase text-[#718143]">Demo</h2>
          <p className="mt-6 max-w-3xl text-3xl font-semibold text-[#26331d]">
            AI travel recommendation, route, checklist болон profile flow-г танилцуулна.
          </p>
          <div className="mt-10 flex items-center gap-3 rounded-full bg-white px-7 py-4 text-xl font-bold text-[#49630b] shadow-md">
            <MousePointer2 className="h-7 w-7" />
            Live product walkthrough
          </div>
        </motion.div>
      </div>
    </SlideShell>
  );
}
