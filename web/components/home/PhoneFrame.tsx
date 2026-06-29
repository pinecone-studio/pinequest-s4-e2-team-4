"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
};

function formatPhoneTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export default function PhoneFrame({ children, className = "" }: PhoneFrameProps) {
  const frameSize = className || "h-[812px] w-[390px]";
  const [time, setTime] = useState("9:41");

  useEffect(() => {
    const updateTime = () => setTime(formatPhoneTime(new Date()));

    updateTime();
    const timer = window.setInterval(updateTime, 1000 * 30);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className={`relative mx-auto max-w-[92vw] rounded-[3.3rem] bg-black p-[10px] shadow-2xl shadow-slate-900/35 ${frameSize}`}
    >
      <div className="absolute left-[-3px] top-32 h-14 w-[5px] rounded-l bg-black" />
      <div className="absolute right-[-3px] top-40 h-24 w-[5px] rounded-r bg-black" />
      <div className="relative h-full overflow-hidden rounded-[2.7rem] bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[50px] items-center justify-between px-7 text-black">
          <time className="min-w-[54px] text-center text-[17px] font-black leading-none tracking-normal">
            {time}
          </time>

          <div className="flex items-center gap-2 pl-2">
            <div className="flex h-[15px] items-end gap-[3px] " aria-hidden="true">
              <span className="h-[5px] w-[4px] rounded-full bg-black" />
              <span className="h-[8px] w-[4px] rounded-full bg-black" />
              <span className="h-[11px] w-[4px] rounded-full bg-black" />
              <span className="h-[14px] w-[4px] rounded-full bg-black" />
            </div>

            <svg
              aria-hidden="true"
              className="h-[16px] w-[19px]"
              fill="none"
              viewBox="0 0 22 16"
            >
              <path
                d="M2 5.5C7.1 1.1 14.9 1.1 20 5.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <path
                d="M5.9 9.1C8.8 6.8 13.2 6.8 16.1 9.1"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <path
                d="M9.7 12.7C10.5 12.1 11.5 12.1 12.3 12.7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>

            <div
              className="relative h-[13px] w-[26px] rounded-[4px] border-[1.8px] border-black p-[1.5px]"
              aria-hidden="true"
            >
              <span className="block h-full w-full rounded-[2px] bg-black" />
              <span className="absolute -right-[4px] top-1/2 h-[6px] w-[2px] -translate-y-1/2 rounded-r bg-black" />
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-[10px] z-50 h-[30px] w-[118px] -translate-x-1/2 rounded-full bg-black shadow-sm" />
        <div className="h-full overflow-hidden pt-0">{children}</div>
      </div>
    </div>
  );
}
