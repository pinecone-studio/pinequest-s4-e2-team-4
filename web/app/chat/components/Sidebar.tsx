"use client";

import React from "react";
import { ChatSession, cx } from "@/app/chat/types";
import { Compass, Plus, Trash2, Calendar } from "lucide-react";

interface SidebarProps {
  sessions: ChatSession[];
  sessionId: string | null;
  sidebarOpen: boolean;
  historyLoading: boolean;
  deletingId: string | null;
  onLoadSession: (id: string) => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onNewChat: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("mn-MN", {
    month: "short",
    day: "numeric",
  });
}

const Sidebar = ({
  sessions,
  sessionId,
  sidebarOpen,
  historyLoading,
  deletingId,
  onLoadSession,
  onDeleteSession,
  onNewChat,
}: SidebarProps) => (
  <div
    className={cx(
      "absolute inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out",
      sidebarOpen ? "translate-x-0" : "-translate-x-full",
    )}
  >
   
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 pt-10 px-4">
      <div className="flex items-center gap-2">
        <Compass className="h-5 w-5 text-[#0A4429]" />
        <span className="text-sm font-bold text-slate-800 tracking-tight">
          Аяллын түүх
        </span>
      </div>
      <button
        onClick={onNewChat}
        className="flex items-center gap-1 rounded-full bg-[#0A4429] hover:bg-[#09884c] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all active:scale-95"
      >
        <Plus className="h-3 w-3" />
        <span>Шинэ</span>
      </button>
    </div>


    <div className="flex-1 space-y-1 overflow-y-auto p-3">
      <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Сүүлд хийсэн чатууд
      </p>

      {historyLoading && (
        <div className="flex items-center justify-center py-10">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#1b9bd7] border-t-transparent" />
        </div>
      )}

      {!historyLoading && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-2xl mb-1 opacity-70">💬</span>
          <p className="text-xs font-medium text-slate-400">
            Чатны түүх хоосон байна
          </p>
        </div>
      )}

      {sessions.map((s) => (
        <div
          key={s.id}
          onClick={() => onLoadSession(s.id)}
          className={cx(
            "group flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 transition-all duration-200 active:scale-[0.98]",
            s.id === sessionId
              ? "border-[#1b9bd7]/20 bg-[#1b9bd7]/5 shadow-sm shadow-[#1b9bd7]/5"
              : "border-transparent hover:bg-slate-50 hover:border-slate-100",
          )}
        >
          <div className="min-w-0 flex-1 flex gap-2.5 items-start">
            <Calendar
              className={cx(
                "h-4 w-4 mt-0.5 flex-shrink-0",
                s.id === sessionId ? "text-[#1b9bd7]" : "text-slate-400",
              )}
            />
            <div className="min-w-0 flex-1">
              <p
                className={cx(
                  "truncate text-sm font-semibold leading-snug",
                  s.id === sessionId ? "text-[#1b9bd7]" : "text-slate-700",
                )}
              >
                {s.title}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">
                {formatDate(s.createdAt)}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => onDeleteSession(s.id, e)}
            disabled={deletingId === s.id}
            aria-label="Устгах"
            className="flex flex-shrink-0 items-center justify-center rounded-lg p-1.5 text-slate-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 focus:opacity-100"
          >
            {deletingId === s.id ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;
