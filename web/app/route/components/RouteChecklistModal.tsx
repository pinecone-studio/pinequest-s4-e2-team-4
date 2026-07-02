"use client";

import { Check, CheckSquare, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useChecklist } from "@/hooks/userChecklist";
import { useLanguage } from "@/app/lib/language";
import { translateChecklistText } from "@/app/lib/checklistTranslations";

const allCategory = "__all__";

type RouteChecklistModalProps = {
  onClose: () => void;
};

export default function RouteChecklistModal({ onClose }: RouteChecklistModalProps) {
  const { language } = useLanguage();
  const t =
    language === "en"
      ? {
          all: "All",
          close: "Close checklist",
          title: "Travel items",
          subtitle: "Checklist created from Chat",
          loading: "Loading checklist...",
          emptyTitle: "Checklist is empty",
          emptyText: "Create your trip prep from Chat.",
          emptyCategory: "No items in this category",
        }
      : {
          all: "Бүгд",
          close: "Checklist хаах",
          title: "Авч явах зүйлс",
          subtitle: "Chat-аас үүссэн checklist",
          loading: "Жагсаалт ачаалж байна...",
          emptyTitle: "Checklist хоосон байна",
          emptyText: "Chat хэсгээс аяллын бэлтгэлээ үүсгээрэй.",
          emptyCategory: "Энэ ангилалд зүйл алга",
        };
  const { checklistItems, deleteItem, loading, toggleItem } = useChecklist();
  const [selectedCategory, setSelectedCategory] = useState(allCategory);

  const categories = useMemo(() => {
    const uniqueCategories = checklistItems
      .map((item) => item.category?.trim())
      .filter((category): category is string => Boolean(category));

    return Array.from(new Set(uniqueCategories));
  }, [checklistItems]);

  const activeCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : allCategory;

  const filteredItems = useMemo(() => {
    if (activeCategory === allCategory) {
      return checklistItems;
    }

    return checklistItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, checklistItems]);

  const displayItems = useMemo(() => {
    const seenTitles = new Set<string>();

    return filteredItems.filter((item) => {
      const translatedCategory = item.category
        ? translateChecklistText(item.category, language, "category")
        : "";
      const translatedTitle = translateChecklistText(item.title, language);
      const key = `${translatedCategory}::${translatedTitle}`
        .trim()
        .toLowerCase();

      if (seenTitles.has(key)) return false;
      seenTitles.add(key);
      return true;
    });
  }, [filteredItems, language]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center px-5">
      <button
        type="button"
        aria-label={t.close}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-[3px]"
      />

      <section className="relative z-10 flex max-h-[72vh] w-full max-w-[340px] flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
              <CheckSquare className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900">{t.title}</h2>
              <p className="text-[11px] font-semibold text-slate-500">{t.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {!loading && checklistItems.length > 0 && (
          <div className="scrollbar-invisible flex shrink-0 gap-2 overflow-x-auto border-b border-slate-100 bg-white/80 px-5 py-3">
            {[allCategory, ...categories].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black transition ${
                  activeCategory === category
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {category === allCategory
                  ? t.all
                  : translateChecklistText(category, language, "category")}
              </button>
            ))}
          </div>
        )}

        <div className="scrollbar-invisible min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="text-xs font-semibold">{t.loading}</p>
            </div>
          ) : checklistItems.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center text-slate-400">
              <CheckSquare className="mb-3 h-9 w-9 stroke-[1.7]" />
              <p className="text-sm font-bold text-slate-500">{t.emptyTitle}</p>
              <p className="mt-1 text-xs">{t.emptyText}</p>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center text-slate-400">
              <CheckSquare className="mb-3 h-9 w-9 stroke-[1.7]" />
              <p className="text-sm font-bold text-slate-500">{t.emptyCategory}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded-2xl border p-3 shadow-sm transition ${
                    item.isCompleted ? "border-slate-100 bg-slate-50" : "border-emerald-50 bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id, item.isCompleted)}
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                      item.isCompleted
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${item.isCompleted ? "text-slate-400 line-through" : "text-slate-700"}`}>
                      {translateChecklistText(item.title, language)}
                    </p>
                    {item.category && (
                      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700/70">
                        {translateChecklistText(
                          item.category,
                          language,
                          "category",
                        )}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="shrink-0 rounded-full p-1.5 text-slate-300 transition hover:bg-rose-50 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
