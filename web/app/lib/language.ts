"use client";

import { useSyncExternalStore } from "react";

export type AppLanguage = "mn" | "en";

const languageStorageKey = "montrip-language";
const languageChangeEvent = "montrip-language-change";

function isAppLanguage(value: string | null): value is AppLanguage {
  return value === "mn" || value === "en";
}

export function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "mn";
  const stored = window.localStorage.getItem(languageStorageKey);
  return isAppLanguage(stored) ? stored : "mn";
}

export function setStoredLanguage(language: AppLanguage) {
  window.localStorage.setItem(languageStorageKey, language);
  window.dispatchEvent(new CustomEvent(languageChangeEvent, { detail: language }));
}

export function useLanguage() {
  const language = useSyncExternalStore<AppLanguage>(
    (onStoreChange) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === languageStorageKey && isAppLanguage(event.newValue)) {
          onStoreChange();
        }
      };

      const handleLanguageChange = (event: Event) => {
        const nextLanguage = (event as CustomEvent<AppLanguage>).detail;
        if (isAppLanguage(nextLanguage)) {
          onStoreChange();
        }
      };

      window.addEventListener("storage", handleStorage);
      window.addEventListener(languageChangeEvent, handleLanguageChange);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(languageChangeEvent, handleLanguageChange);
      };
    },
    getStoredLanguage,
    () => "mn",
  );

  const setLanguage = (nextLanguage: AppLanguage) => {
    setStoredLanguage(nextLanguage);
  };

  return { language, setLanguage };
}
