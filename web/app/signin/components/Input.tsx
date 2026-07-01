"use client";

import { useLoginForm } from "../../../hooks/useLoginForm";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { SignupLink } from "./SignupLink";
import { WaveDivider } from "./WaveDivider";
import { useLanguage } from "@/app/lib/language";

const text = {
  mn: {
    helper: "Нэвтрэхийн тулд мэдээллээ оруулна уу",
    loading: "Уншиж байна...",
    submit: "Нэвтрэх",
  },
  en: {
    helper: "Enter your details to sign in",
    loading: "Loading...",
    submit: "Sign in",
  },
} as const;

export default function Input() {
  const { language } = useLanguage();
  const t = text[language];
  const {
    email,
    password,
    showPassword,
    isLoading,
    error,
    isSignupTransitioning,
    errorFlags,
    setEmail,
    setPassword,
    setShowPassword,
    clearError,
    handleSubmit,
    handleSignupClick,
  } = useLoginForm();

  return (
    <form
      className="absolute inset-x-0 bottom-0 top-107.5 z-20 overflow-visible bg-white px-6 pb-4 shadow-2xl shadow-lime-950/10"
      onSubmit={handleSubmit}
    >
      <WaveDivider />

      <div className="relative z-10 mb-2.5 flex items-center gap-3">
        <p className="mt-0.5 text-[13px] font-medium leading-5 text-zinc-500">
          {t.helper}
        </p>
      </div>

      <EmailField
        value={email}
        error={errorFlags.isEmailError ? error : null}
        isLoading={isLoading}
        onChange={(val) => {
          setEmail(val);
          clearError();
        }}
      />

      <PasswordField
        value={password}
        error={errorFlags.isPasswordError ? error : null}
        isLoading={isLoading}
        showPassword={showPassword}
        onChange={(val) => {
          setPassword(val);
          clearError();
        }}
        onToggleVisibility={() => setShowPassword((prev) => !prev)}
      />

      {errorFlags.isGeneralError && (
        <p className="relative z-10 mt-2 text-left text-[11px] font-semibold text-red-500">
          {error}
        </p>
      )}

      <button
        className="relative z-10 mt-4 flex h-12.5 w-full items-center justify-center rounded-[17px] bg-[#0A4429] text-[20px] font-bold text-white shadow-lg shadow-lime-600/25 disabled:bg-zinc-400 disabled:shadow-none"
        type="submit"
        disabled={isLoading}
      >
        <span className="flex-1 text-center">
          {isLoading ? t.loading : t.submit}
        </span>
      </button>

      <SignupLink
        isTransitioning={isSignupTransitioning}
        onClick={handleSignupClick}
      />
    </form>
  );
}
