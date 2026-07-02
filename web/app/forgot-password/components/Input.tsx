"use client";

import { ArrowLeft, KeyRound, Lock, Mail } from "lucide-react";
import Link from "next/link";

import { useForgotPasswordForm } from "@/hooks/useForgotPasswordForm";
import { useLanguage } from "@/app/lib/language";

const forgotText = {
  mn: {
    titleStepOne: "Нууц үгээ мартсан уу?",
    titleStepTwo: "Нууц үг шинэчлэх",
    email: "Имэйл хаяг",
    emailPlaceholder: "Имэйл хаягаа оруулна уу",
    code: "Баталгаажуулах код",
    codePlaceholder: "6 оронтой кодыг оруулна уу",
    newPassword: "Шинэ нууц үг",
    newPasswordPlaceholder: "Шинэ нууц үгээ оруулна уу",
    submitting: "Илгээж байна...",
    sendInstruction: "Заавар илгээх",
    resetPassword: "Нууц үг шинэчлэх",
    divider: "эсвэл",
    backToSignin: "Нэвтрэх хуудас руу буцах",
  },
  en: {
    titleStepOne: "Forgot your password?",
    titleStepTwo: "Reset password",
    email: "Email address",
    emailPlaceholder: "Enter your email address",
    code: "Verification code",
    codePlaceholder: "Enter the 6-digit code",
    newPassword: "New password",
    newPasswordPlaceholder: "Enter your new password",
    submitting: "Sending...",
    sendInstruction: "Send instructions",
    resetPassword: "Reset password",
    divider: "or",
    backToSignin: "Back to sign in",
  },
} as const;

function translateForgotMessage(message: string, language: "mn" | "en") {
  if (!message || language === "mn") return message;
  const normalized = message.toLowerCase();

  if (normalized.includes("код") && normalized.includes("илгэ")) {
    return "Verification code sent.";
  }
  if (normalized.includes("амжилттай") || normalized.includes("шинэчл")) {
    return "Password reset successfully.";
  }
  if (normalized.includes("алдаа")) {
    return "Something went wrong. Please try again.";
  }
  if (normalized.includes("имэйл")) {
    return "Please enter your email address.";
  }

  return message;
}

export default function Input() {
  const { language } = useLanguage();
  const t = forgotText[language];
  const {
    email,
    setEmail,
    message,
    isSubmitting,
    step,
    code,
    setCode,
    newPassword,
    setNewPassword,
    handleSubmit,
  } = useForgotPasswordForm();
  const displayMessage = translateForgotMessage(message, language);

  return (
    <form
      className="absolute inset-x-0 bottom-0 top-[440px] z-20 bg-white px-6 pb-5 pt-2 shadow-2xl shadow-lime-950/10"
      onSubmit={handleSubmit}
    >
      <svg
        aria-hidden="true"
        className="absolute -top-11 left-0 h-14 w-full text-white"
        preserveAspectRatio="none"
        viewBox="0 0 390 56"
      >
        <path
          d="M0 56V19C48 0 92 15 137 24C185 34 230 34 278 23C323 12 356 4 390 19V56H0Z"
          fill="currentColor"
        />
      </svg>
      <div className="flex items-center gap-4">
        <div className="min-w-0">
          <h2 className="text-[22px] font-black leading-tight text-zinc-950">
            {step === 1 ? t.titleStepOne : t.titleStepTwo}
          </h2>
        </div>
      </div>

      <label className="mt-6 block text-[15px] font-extrabold text-zinc-950">
        {t.email}
        <span className="mt-2.5 flex h-[50px] items-center gap-3 rounded-[15px] border border-zinc-200 px-3 shadow-sm shadow-zinc-200/40">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-lime-50">
            <Mail className="h-5 w-5 text-lime-600" />
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400 disabled:opacity-60"
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t.emailPlaceholder}
            type="email"
            value={email}
            disabled={step === 2}
          />
        </span>
      </label>

      {step === 2 && (
        <>
          <label className="mt-4 block text-[15px] font-extrabold text-zinc-950">
            {t.code}
            <span className="mt-2.5 flex h-[50px] items-center gap-3 rounded-[15px] border border-zinc-200 px-3 shadow-sm shadow-zinc-200/40">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-lime-50">
                <KeyRound className="h-5 w-5 text-lime-600" />
              </span>
              <input
                className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
                onChange={(event) => setCode(event.target.value)}
                placeholder={t.codePlaceholder}
                type="text"
                maxLength={6}
                value={code}
              />
            </span>
          </label>

          <label className="mt-4 block text-[15px] font-extrabold text-zinc-950">
            {t.newPassword}
            <span className="mt-2.5 flex h-[50px] items-center gap-3 rounded-[15px] border border-zinc-200 px-3 shadow-sm shadow-zinc-200/40">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-lime-50">
                <Lock className="h-5 w-5 text-lime-600" />
              </span>
              <input
                className="min-w-0 flex-1 bg-transparent text-[16px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder={t.newPasswordPlaceholder}
                type="password"
                value={newPassword}
              />
            </span>
          </label>
        </>
      )}

      {displayMessage ? (
        <p className="mt-3 text-center text-[13px] font-semibold leading-5 text-lime-700">
          {displayMessage}
        </p>
      ) : null}

      <button
        className="mt-5 flex h-[52px] w-full items-center justify-center rounded-[15px] bg-lime-600 px-4 text-[20px] font-black text-white shadow-lg shadow-lime-600/25 transition active:scale-[0.99] disabled:opacity-70"
        disabled={isSubmitting}
        type="submit"
      >
        <span className="flex-1 text-center">
          {isSubmitting
            ? t.submitting
            : step === 1
              ? t.sendInstruction
              : t.resetPassword}
        </span>
      </button>

      <div className="mt-5 flex items-center gap-4 text-[13px] font-semibold text-zinc-400">
        <span className="h-px flex-1 bg-zinc-200" />
        <span>{t.divider}</span>
        <span className="h-px flex-1 bg-zinc-200" />
      </div>

      <Link
        className="mt-4 flex h-[50px] w-full items-center justify-center gap-3 rounded-[15px] border border-zinc-200 text-[16px] font-semibold text-zinc-800 shadow-sm shadow-zinc-200/30"
        href="/signin"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>{t.backToSignin}</span>
      </Link>
    </form>
  );
}
