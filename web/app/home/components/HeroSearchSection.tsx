
"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/app/lib/language";

const text = {
  mn: {
    greeting: "Сайн байна уу,",
    traveler: "Аялагч аа",
    intro: "AI туслах тань аяллыг төлөвлөхөд бэлэн байна.",
    placeholder: "Хаашаа аялах вэ?",
  },
  en: {
    greeting: "Hello,",
    traveler: "Traveler",
    intro: "Your AI assistant is ready to plan the trip.",
    placeholder: "Where are you traveling?",
  },
} as const;

export default function HeroSearchSection() {
  const { language } = useLanguage();
  const t = text[language];
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    sessionStorage.setItem("montrip-initial-chat-prompt", trimmedQuery);
    router.push(`/chat?prompt=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="w-full px-5 pt-4 pb-2 text-left">

      <h1 className="text-2xl font-bold text-[#0F2942] leading-tight">
        {t.greeting} <br />
        <span className="text-[#0A4429] flex items-center gap-1">
          {t.traveler}
        </span>
      </h1>
      
      <p className="text-xs text-gray-500 mt-1 max-w-[240px]">
        {t.intro}
      </p>


      <form
        onSubmit={handleSubmit}
        className="mt-5 flex items-center justify-between bg-[#F5F7FA] rounded-full pl-4 pr-1.5 py-1.5 border border-gray-100 shadow-sm focus-within:ring-2 focus-within:ring-[#0A4429]/20 transition-all"
      >
        <div className="flex items-center gap-2.5 w-full">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.placeholder}
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
          />
        </div>
        

        <button
          type="submit"
          className="h-8 w-8 rounded-full bg-[#0A4429] flex items-center justify-center text-white shadow-md hover:bg-[#083520] transition-colors shrink-0"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
