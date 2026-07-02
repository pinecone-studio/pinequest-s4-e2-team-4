"use client";

import { useState, useEffect } from "react";
import { CheckSquare, ArrowRight } from "lucide-react";
import { useLanguage } from "@/app/lib/language";

type HeroChecklistCardProps = {
  onOpenChecklist?: () => void;
};

const targetDate = new Date("2026-07-10T09:00:00");
const text = {
  mn: {
    title: "Аяллын бэлтгэл",
    subtitle: "чемоданаа бэлдэх",
    body: "Замд гарахаас өмнө чемоданаа бэлдсэн үү? Авч явах зүйлсийн жагсаалтаа эндээс шалгаарай.",
    action: "Жагсаалт үзэх",
  },
  en: {
    title: "Trip prep",
    subtitle: "pack your bag",
    body: "Packed before you leave? Check your travel checklist here.",
    action: "View checklist",
  },
} as const;

export default function HeroChecklistCard({ onOpenChecklist }: HeroChecklistCardProps) {
  const { language } = useLanguage();
  const t = text[language];
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f3faf7] via-white to-[#edf7f3] p-6 border border-emerald-50 shadow-lg shadow-emerald-950/5">

      <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-emerald-100/50 blur-2xl" />
      <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-emerald-50/70 blur-xl" />

      <div className="relative flex flex-col gap-4">
        

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0A4429] text-white shadow-md shadow-emerald-900/20">
              <CheckSquare className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-black text-[#0F2942] text-base tracking-tight">
                {t.title}
              </h3>
              <p className="text-[11px] font-bold text-emerald-700/80 uppercase tracking-wider">
                {t.subtitle}
              </p>
            </div>
          </div>


          {(timeLeft.days > 0 || timeLeft.hours > 0) && (
            <div className="flex items-center gap-1 rounded-xl bg-emerald-950/5 px-2.5 py-1 text-[10px] font-black text-[#0A4429]">
            </div>
          )}
        </div>


        <p className="text-xs font-medium text-slate-500 leading-relaxed pr-2">
          {t.body}
        </p>


        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenChecklist}
            className="group inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0A4429] px-6 text-xs font-black text-white shadow-md shadow-emerald-900/10 transition-all hover:bg-[#083520] hover:shadow-emerald-900/20 active:scale-95"
          >
            <span>{t.action}</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5] transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
}
