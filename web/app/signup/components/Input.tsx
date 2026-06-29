"use client";

import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";

function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-lime-50">
      {children}
    </span>
  );
}

export default function Input() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSigninTransitioning, setIsSigninTransitioning] = useState(false);
  const PasswordIcon = showPassword ? Eye : EyeOff;
  const ConfirmPasswordIcon = showConfirmPassword ? Eye : EyeOff;

  const handleSigninClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (isSigninTransitioning) {
      return;
    }

    setIsSigninTransitioning(true);
    window.setTimeout(() => router.push("/signin"), 420);
  };

  return (
    <form
      className="absolute inset-x-0 bottom-0 top-[318px] z-20 overflow-visible bg-white px-6 pb-4 pt-5 shadow-2xl shadow-lime-950/10"
      onSubmit={(event) => event.preventDefault()}
    >
      <svg
        aria-hidden="true"
        className="absolute -top-11 left-0 h-14 w-full text-white"
        preserveAspectRatio="none"
        viewBox="0 0 390 56"
      >
        <path
          d="M0 56V20C44 1 92 8 138 18C187 29 234 31 282 20C326 10 360 5 390 19V56H0Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 mb-3 flex items-center gap-4">
        <div>
          <h2 className="text-[22px] font-black leading-tight text-zinc-950">
            Бүртгүүлээрэй!
          </h2>
        </div>
      </div>

      <div className="relative z-10 space-y-2">
        <label className="block">
          <span className="flex h-[40px] items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <User className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Нэр"
              type="text"
            />
          </span>
        </label>

        <label className="block">
          <span className="flex h-[40px] items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <Phone className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Утас"
              type="tel"
            />
          </span>
        </label>

        <label className="block">
          <span className="flex h-[40px] items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <Mail className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Таны имэйл хаяг"
              type="email"
            />
          </span>
        </label>

        <label className="block">
          <span className="flex h-[40px] items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <Lock className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Нууц үг"
              type={showPassword ? "text" : "password"}
            />
            <button
              aria-label="Нууц үг харах"
              className="text-lime-600"
              onClick={() => setShowPassword((value) => !value)}
              type="button"
            >
              <PasswordIcon className="h-5 w-5" />
            </button>
          </span>
        </label>

        <label className="block">
          <span className="flex h-[40px] items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <Lock className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Нууц үг давтах"
              type={showConfirmPassword ? "text" : "password"}
            />
            <button
              aria-label="Нууц үг давтах харах"
              className="text-lime-600"
              onClick={() => setShowConfirmPassword((value) => !value)}
              type="button"
            >
              <ConfirmPasswordIcon className="h-5 w-5" />
            </button>
          </span>
        </label>
      </div>

      <label className="relative z-10 mt-2.5 flex items-start gap-3 text-[12px] font-semibold leading-5 text-zinc-500">
        <input
          className="mt-1 h-5 w-5 shrink-0 rounded border-zinc-300 accent-lime-600"
          type="checkbox"
        />
        <span>
          Үйлчилгээний{" "}
          <Link className="font-bold text-lime-600" href="/terms">
            нөхцөл
          </Link>
          ,{" "}
          <Link className="font-bold text-lime-600" href="/privacy">
            нууцлалын бодлогыг
          </Link>{" "}
          зөвшөөрч байна
        </span>
      </label>

      <button
        className="relative z-10 mt-3 flex h-[48px] w-full items-center justify-center rounded-[17px] bg-lime-600 text-[20px] font-bold text-white shadow-lg shadow-lime-600/25"
        type="submit"
      >
        <span className="flex-1 text-center">Бүртгүүлэх</span>
      </button>

      <p className="relative z-10 mt-3 text-center text-[15px] font-medium text-zinc-500">
        Бүртгэлтэй юу?{" "}
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
          <span className="relative">Нэвтрэх</span>
        </Link>
      </p>
    </form>
  );
}
