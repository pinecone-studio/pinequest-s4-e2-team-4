"use client";

import {
  Bell,
  BellOff,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { useHeroChecklistDrawer } from "./useHeroChecklistDrawer";

export default function HeroChecklistDrawerContent() {
  const checklist = useHeroChecklistDrawer();

  if (!checklist.isLoaded) return null;

  return (
    <>
      {checklist.categories.length > 0 && (
        <div className="scrollbar-invisible flex shrink-0 gap-2 overflow-x-auto border-b border-gray-50 bg-white px-5 py-3">
          {checklist.categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => checklist.setSelectedCategory(cat)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black transition-all ${
                checklist.selectedCategory === cat
                  ? "bg-[#0A4429] text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={checklist.addItem}
        className="flex shrink-0 gap-2 bg-white p-5 pb-3"
      >
        <input
          type="text"
          value={checklist.inputValue}
          onChange={(event) => checklist.setInputValue(event.target.value)}
          placeholder={
            checklist.selectedCategory
              ? `"${checklist.selectedCategory}" ангилалд нэмэх...`
              : "Юм нэмэх..."
          }
          className="flex-1 rounded-xl border border-transparent bg-gray-50 px-4 py-2.5 text-xs outline-none transition-all placeholder:text-gray-400 focus:border-emerald-500"
        />
        <button
          type="submit"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A4429] text-white shadow-sm transition-colors hover:bg-[#083520]"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <div className="shrink-0 border-b border-gray-100 bg-white px-5 pb-4">
        {checklist.isAlarmTriggered ? (
          <div className="flex animate-pulse items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 p-3 shadow-sm">
            <span className="text-xs font-black tracking-tight text-rose-800">
              ЦАГ БОЛЛОО: Юмаа бэлдээрэй!
            </span>
            <button
              type="button"
              onClick={() => checklist.setIsAlarmTriggered(false)}
              className="rounded-xl bg-rose-600 px-3 py-1.5 text-[10px] font-black text-white shadow-md hover:bg-rose-700"
            >
              УНТРААХ
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1.5 rounded-2xl border border-gray-100 bg-gray-50/80 p-2.5">
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <div className="flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-gray-100 bg-white px-1.5 py-1">
                <Calendar className="h-3 w-3 shrink-0 text-gray-400" />
                <input
                  type="date"
                  value={checklist.alarmDate}
                  disabled={checklist.isAlarmSet}
                  onChange={(event) =>
                    checklist.setAlarmDate(event.target.value)
                  }
                  className="w-full bg-transparent text-[10.5px] font-bold text-gray-700 outline-none disabled:opacity-50"
                />
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-100 bg-white px-1.5 py-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <input
                  type="time"
                  value={checklist.alarmTime}
                  disabled={checklist.isAlarmSet}
                  onChange={(event) =>
                    checklist.setAlarmTime(event.target.value)
                  }
                  className="w-11 bg-transparent text-[10.5px] font-bold text-gray-700 outline-none disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={checklist.toggleAlarmSetting}
              className={`flex h-7 shrink-0 items-center gap-1 rounded-xl px-2.5 text-[10px] font-black transition-all ${
                checklist.isAlarmSet
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {checklist.isAlarmSet ? (
                <Bell className="h-3 w-3 animate-pulse" />
              ) : (
                <BellOff className="h-3 w-3" />
              )}
              {checklist.isAlarmSet ? "Асаалттай" : "Сануулах"}
            </button>
          </div>
        )}
      </div>

      <div className="scrollbar-invisible flex-1 overflow-y-auto px-5 pb-6 pt-4">
        {checklist.visibleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
            <CheckSquare className="mb-2 h-10 w-10 text-gray-300" />
            <p className="text-xs">Энэ ангилалд зүйл алга.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {checklist.visibleItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all ${
                  item.isCompleted
                    ? "border-gray-100 bg-gray-50/60"
                    : "border-gray-100 bg-white shadow-sm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => checklist.toggleCheck(item.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                      item.isCompleted
                        ? "border-[#0A4429] bg-[#0A4429] text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {item.isCompleted && (
                      <Check className="h-2.5 w-2.5 stroke-3" />
                    )}
                  </span>
                  <span
                    className={`text-xs font-medium transition-all ${item.isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}
                  >
                    {item.title}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => checklist.deleteItem(item.id)}
                  className="p-1 text-gray-400 transition-colors hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
