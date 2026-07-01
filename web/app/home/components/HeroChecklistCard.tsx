
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckSquare, Calendar, Clock } from "lucide-react";

export default function HeroChecklistCard() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });


  const targetDate = new Date("2026-07-10T09:00:00"); 

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
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-5 shadow-sm">
    

      <div className="flex items-start gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0A4429] text-white shadow-md shadow-emerald-900/10">
          <CheckSquare className="h-6 w-6" />
        </div>


        <div className="flex-1 text-left">
          <h3 className="font-bold text-[#0F2942] text-base">Аяллын бэлтгэл</h3>
          <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
            Замд гарахаас өмнө чемоданаа бэлдсэн үү? Авч явах зүйлсийн жагсаалтаа эндээс шалгаарай.
          </p>
          

          <Link
            href="/checklist"
            className="mt-3.5 inline-flex h-9 items-center justify-center rounded-full bg-[#0A4429] px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#083520] hover:scale-[1.02]"
          >
            Жагсаалт үзэх
          </Link>
        </div>
      </div>
    </div>
  );
}