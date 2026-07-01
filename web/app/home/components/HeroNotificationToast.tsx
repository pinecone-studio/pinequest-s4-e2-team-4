"use client";

import { Bell } from "lucide-react";
import type { MonTripNotification } from "./heroNotificationTypes";
import { useLanguage } from "@/app/lib/language";

type HeroNotificationToastProps = {
  notification: MonTripNotification;
  onOpenChecklist: () => void;
};

export default function HeroNotificationToast({
  notification,
  onOpenChecklist,
}: HeroNotificationToastProps) {
  const { language } = useLanguage();
  return (
    <div className="absolute left-4 right-4 top-12 z-50">
      <button
        type="button"
        onClick={onOpenChecklist}
        className="montrip-ios-notification-toast w-full rounded-[22px] border border-white/70 bg-white/90 p-3 text-left shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A4429] text-white">
            <Bell className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                MonTrip
              </p>
              <span className="text-[10px] font-bold text-slate-400">
                {language === "en" ? "now" : "одоо"}
              </span>
            </div>
            <p className="mt-0.5 text-sm font-black text-slate-900">
              {notification.title}
            </p>
            <p className="mt-0.5 text-xs font-semibold leading-snug text-slate-600">
              {notification.message}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
