"use client";
 
import { useState } from "react";
import { motion } from "framer-motion";
 
export default function Header() {
  const [lang, setLang] = useState<"mn" | "en">("mn");
 
  const toggleLang = () => {
    setLang((prev) => (prev === "mn" ? "en" : "mn"));
  };
 
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-teal-700 cursor-pointer">
          MonTrip
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="relative overflow-hidden rounded-full border border-gray-200 bg-white px-5 py-2 text-sm text-gray-700 shadow-sm transition
                       hover:border-teal-400 hover:text-teal-700 hover:shadow-md active:scale-95"
          >
            <span className="font-medium">
              {lang === "mn" ? "MN → EN" : "EN → MN"}
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
 