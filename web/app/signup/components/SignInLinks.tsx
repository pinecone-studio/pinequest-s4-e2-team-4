"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useState } from "react";
import { useLanguage } from "@/app/lib/language";

export function SigninLink() {
  const { language } = useLanguage();
  const t =
    language === "en"
      ? { question: "Already have an account?", action: "Sign in" }
      : { question: "Бүртгэлтэй юу?", action: "Нэвтрэх" };
  const router = useRouter();
  const [isSigninTransitioning, setIsSigninTransitioning] = useState(false);

  const handleSigninClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isSigninTransitioning) {
      return;
    }

    setIsSigninTransitioning(true);
    window.setTimeout(() => router.push("/signin"), 420);
  };

  return (
    <p className="relative z-10 mt-3 text-center text-[15px] font-medium text-zinc-500">
      {t.question}{" "}
      <Link
        aria-disabled={isSigninTransitioning}
        className={`relative inline-flex overflow-hidden rounded-full px-1 font-bold text-lime-600 transition-colors duration-300 ${
          isSigninTransitioning ? "pointer-events-none text-white" : ""
        }`}
        href="/signin"
        onClick={handleSigninClick}
      >
        <span
          className={`absolute inset-0 -z-10 rounded-full bg-lime-600 transition-transform duration-300 ${
            isSigninTransitioning ? "scale-x-100" : "scale-x-0"
          } origin-left`}
        />
        <span className="relative">{t.action}</span>
      </Link>
    </p>
  );
}
