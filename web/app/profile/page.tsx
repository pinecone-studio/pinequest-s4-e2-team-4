"use client";

import Footer from "@/components/home/Footer";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import PhoneFrame from "@/components/home/PhoneFrame";
import { useProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Languages,
  Lock,
  LogOut,
  MoreVertical,
  User,
} from "lucide-react";
import { AppLanguage, useLanguage } from "@/app/lib/language";

const menuItems = [
  {
    id: "my-profile",
    icon: <User className="w-5 h-5 text-blue-400" />,
    label: { mn: "Миний профайл", en: "My Profile" },
    bg: "bg-blue-50",
    href: "/my-profile",
    action: "navigate",
  },
  {
    id: "change-password",
    icon: <Lock className="w-5 h-5 text-orange-400" />,
    label: { mn: "Нууц үг солих", en: "Change Password" },
    bg: "bg-orange-50",
    href: "/change-password",
    action: "navigate",
  },
  {
    id: "change-language",
    icon: <Languages className="w-5 h-5 text-pink-500" />,
    label: { mn: "Хэл солих", en: "Change Language" },
    bg: "bg-pink-50",
    href: null,
    action: "language",
  },
] as const;

const languageOptions: { label: string; value: AppLanguage }[] = [
  { label: "MN", value: "mn" },
  { label: "EN", value: "en" },
];

export default function Page() {
  const { language, setLanguage } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const t =
    language === "en"
      ? {
          title: "Profile",
          overview: "Account Overview",
          logout: "Log out",
          languageTitle: "Choose language",
          languageHint: "This changes the app language.",
        }
      : {
          title: "Профайл",
          overview: "Бүртгэлийн тойм",
          logout: "Гарах",
          languageTitle: "Хэл сонгох",
          languageHint: "Аппын хэлийг эндээс солино.",
        };
  const router = useRouter();
  const {
    user,
    loading,
    isUploading,
    fileInputRef,
    handleAvatarClick,
    handleFileChange,
    handleLogout,
  } = useProfile();

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <HomeBackdrop active={true} />
      <div className="relative z-10">
        <PhoneFrame>
          <div className="h-[95%] flex flex-col">
            <div className="flex flex-col justify-between h-full">
              <div className="flex-1 overflow-y-auto bg-gray-100">
                <div
                  className="relative overflow-hidden flex flex-col items-center pb-10 pt-10 px-4"
                  style={{ backgroundColor: "#1a3c2e" }}
                >
                  <div className="w-full flex items-center justify-between mb-6 relative z-10">
                    <h1 className="text-white text-xl font-bold">{t.title}</h1>
                    <button className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center">
                      <MoreVertical className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {loading ? (
                    <div className="animate-pulse flex flex-col items-center w-full">
                      <div className="w-24 h-24 rounded-full bg-gray-400/30 mb-3" />
                      <div className="h-5 w-32 bg-gray-400/30 rounded mb-2" />
                    </div>
                  ) : (
                    <>
                      <div
                        onClick={handleAvatarClick}
                        className="relative mb-3 z-10 cursor-pointer group"
                      >
                        <div
                          className={`w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-gray-200 transition-opacity ${isUploading ? "opacity-50" : "group-hover:opacity-90"}`}
                        >
                          <img
                            src={user?.profileImage || "/montrip.png"}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center bg-[#e8924a] shadow-md">
                          {isUploading ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg
                              className="w-3.5 h-3.5 fill-white"
                              viewBox="0 0 24 24"
                            >
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <h2 className="text-white text-lg font-bold z-10">
                        {user?.name || user?.username || "MnkhDlai"}
                      </h2>
                      <p className="text-white/60 text-sm z-10">
                        {user?.email}
                      </p>
                    </>
                  )}
                </div>

                <div className="bg-white mx-3 rounded-3xl overflow-hidden shadow-sm z-10 -mt-5 relative">
                  <div className="px-4 pt-5 pb-2">
                    <p className="text-sm font-bold text-gray-800 mb-3">
                      {t.overview}
                    </p>
                  </div>

                  {menuItems.map((item) => (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (item.action === "language") {
                            setIsLanguageOpen((open) => !open);
                            return;
                          }

                          if (item.href) router.push(item.href);
                        }}
                        className="w-full flex items-center px-4 py-3.5 hover:bg-gray-50 transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${item.bg}`}
                        >
                          {item.icon}
                        </div>
                        <span className="flex-1 text-left text-sm font-medium text-gray-800">
                          {item.label[language]}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-gray-300 transition-transform ${
                            item.action === "language" && isLanguageOpen
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </button>

                      {item.action === "language" && isLanguageOpen && (
                        <div className="mx-4 mb-4 rounded-2xl bg-gray-50 p-3">
                          <div className="mb-3">
                            <p className="text-xs font-bold text-gray-800">
                              {t.languageTitle}
                            </p>
                            <p className="mt-0.5 text-[11px] font-medium text-gray-400">
                              {t.languageHint}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {languageOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setLanguage(option.value)}
                                className={`h-10 rounded-xl text-xs font-black transition ${
                                  language === option.value
                                    ? "bg-[#0A4429] text-white shadow-sm"
                                    : "bg-white text-gray-500 hover:bg-gray-100"
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="pb-2" />
                </div>

                <div className="mx-3 mb-24 mt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full bg-white rounded-2xl py-3.5 flex items-center justify-center gap-2 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    {t.logout}
                  </button>
                </div>
              </div>

              <div className="absolute top-[88%] w-full">
                <Footer />
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
