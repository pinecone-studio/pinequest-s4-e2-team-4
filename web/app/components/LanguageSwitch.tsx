"use client";

import { Languages } from "lucide-react";
import { AppLanguage, useLanguage } from "@/app/lib/language";

const options: { label: string; value: AppLanguage }[] = [
  { label: "MN", value: "mn" },
  { label: "EN", value: "en" },
];

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/85 p-1 text-[11px] font-black text-slate-500 shadow-lg shadow-emerald-950/10 backdrop-blur">
      <Languages className="ml-1 h-3.5 w-3.5 text-[#0A4429]" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          className={`h-7 rounded-full px-2.5 transition ${
            language === option.value
              ? "bg-[#0A4429] text-white shadow-sm"
              : "text-slate-500 hover:bg-slate-100"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

