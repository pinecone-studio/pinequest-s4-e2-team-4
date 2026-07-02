"use client";

import { Bell, CheckCircle2, Trash2, X } from "lucide-react";
import type { KeyboardEvent } from "react";
import type { MonTripNotification } from "./heroNotificationTypes";
import { useLanguage } from "@/app/lib/language";

type HeroNotificationPanelProps = {
  notifications: MonTripNotification[];
  onClose: () => void;
  onDeleteNotification: (notificationId: string) => void;
  onOpenChecklist: () => void;
};

export default function HeroNotificationPanel({
  notifications,
  onClose,
  onDeleteNotification,
  onOpenChecklist,
}: HeroNotificationPanelProps) {
  const { language } = useLanguage();
  const t =
    language === "en"
      ? {
          close: "Close notifications",
          title: "Notifications",
          empty: "You have no notifications",
          delete: "Delete notification",
        }
      : {
          close: "Notification хаах",
          title: "Мэдэгдэл",
          empty: "Танд мэдэгдэл ирээгүй байна",
          delete: "Мэдэгдэл устгах",
        };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenChecklist();
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center bg-slate-950/25 px-5 pt-24 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label={t.close}
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 w-full overflow-hidden rounded-[28px] border border-white/70 bg-white/95 shadow-2xl backdrop-blur-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-black text-slate-900">{t.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="scrollbar-invisible max-h-[360px] overflow-y-auto px-4 py-4">
          {notifications.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center text-center">
              <CheckCircle2 className="mb-3 h-10 w-10 text-slate-300" />
              <p className="text-sm font-bold text-slate-600">
                {t.empty}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <article
                  key={notification.id}
                  role="button"
                  tabIndex={0}
                  onClick={onOpenChecklist}
                  onKeyDown={handleCardKeyDown}
                  className="rounded-3xl border border-slate-100 bg-slate-50/80 p-4 text-left outline-none transition hover:bg-slate-100 focus:ring-2 focus:ring-emerald-700/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#0A4429] text-white">
                      <Bell className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-slate-900">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-snug text-slate-600">
                        {notification.message}
                      </p>
                      {notification.itemTitles.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {notification.itemTitles.map((title) => (
                            <p
                              key={title}
                              className="truncate text-[11px] font-bold text-slate-500"
                            >
                              - {title}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={t.delete}
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteNotification(notification.id);
                      }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm transition hover:bg-rose-50 hover:text-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
