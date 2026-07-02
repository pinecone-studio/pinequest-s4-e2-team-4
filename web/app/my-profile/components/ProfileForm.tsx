import React from "react";
import { ProfileFormState } from "./types";
import { useLanguage } from "@/app/lib/language";

interface ProfileFormProps {
  form: ProfileFormState;
  email: string;
  isDirty: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  form,
  email,
  isDirty,
  saving,
  error,
  success,
  onChange,
  onSubmit,
}) => {
  const { language } = useLanguage();
  const t =
    language === "en"
      ? {
          section: "Personal information",
          name: "Name",
          namePlaceholder: "Enter your name",
          phone: "Phone number",
          email: "Email",
          saving: "Saving...",
          save: "Save",
          noChanges: "No changes",
        }
      : {
          section: "Хувийн мэдээлэл",
          name: "Нэр",
          namePlaceholder: "Нэрээ оруулна уу",
          phone: "Утасны дугаар",
          email: "Имэйл",
          saving: "Хадгалж байна…",
          save: "Хадгалах",
          noChanges: "Өөрчлөлт алга",
        };

  return (
    <div className="-mt-8 flex-1 rounded-t-[2rem] bg-white px-5 pb-8 pt-20">
      <span className="px-1 pb-3 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
        {t.section}
      </span>

      <form onSubmit={onSubmit} className="flex flex-col gap-1">
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
          {/* Нэр */}
          <label className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                <path d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6" />
              </svg>
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] text-zinc-400">{t.name}</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder={t.namePlaceholder}
                className="w-full bg-transparent py-0.5 text-sm text-zinc-900 outline-none placeholder-zinc-300"
              />
            </div>
          </label>

          <div className="h-px bg-zinc-100" />

          {/* Утасны дугаар */}
          <label className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.25c1.1.36 2.3.56 3.5.56a1 1 0 011 1V20a1 1 0 01-1 1C10.6 21 3 13.4 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.2.2 2.4.56 3.5a1 1 0 01-.25 1L6.6 10.8z" />
              </svg>
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] text-zinc-400">{t.phone}</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="99112233"
                className="w-full bg-transparent py-0.5 text-sm text-zinc-900 outline-none placeholder-zinc-300"
              />
            </div>
          </label>

          <div className="h-px bg-zinc-100" />

          {/* Имэйл (Readonly) */}
          <div className="flex items-center gap-3 px-4 py-3.5 opacity-50">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-500">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] text-zinc-400">{t.email}</span>
              <span className="truncate py-0.5 text-sm text-zinc-600">
                {email}
              </span>
            </div>
            <svg
              className="h-3.5 w-3.5 shrink-0 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V7a4 4 0 118 0v4" />
            </svg>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={!isDirty || saving}
          className="mt-6 w-full rounded-2xl bg-[#233d2f] py-3.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          {saving ? t.saving : isDirty ? t.save : t.noChanges}
        </button>
      </form>
    </div>
  );
};
