import React from "react";
import { ProfileData } from "./types";
import { getInitials } from "./utils";
import { useLanguage } from "@/app/lib/language";

interface ProfileHeaderProps {
  profile: ProfileData | null;
  onBack: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onBack,
}) => {
  const { language } = useLanguage();
  const t =
    language === "en"
      ? { title: "Profile", back: "Back", unnamed: "Unnamed user" }
      : { title: "Profile", back: "Буцах", unnamed: "Нэргүй хэрэглэгч" };

  return (
    <div className="relative bg-gradient-to-b from-[#233d2f] to-[#1c3226] px-6 pb-14 pt-10">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold text-white">{t.title}</h1>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 cursor-pointer active:scale-95"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          {t.back}
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/10 bg-white text-xl font-bold text-[#1c3226]">
            {profile?.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.profileImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(profile?.name ?? null, profile?.email ?? "")
            )}
          </div>
        </div>
        <h2 className="mt-4 text-lg font-bold uppercase tracking-wide text-white">
          {profile?.name?.trim() || t.unnamed}
        </h2>
        <p className="mt-0.5 text-sm text-white/55">{profile?.email}</p>
      </div>
    </div>
  );
};
