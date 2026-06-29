"use client";

import { useSignupForm } from "@/hooks/useSignUpForm";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FieldIcon } from "./FIeldIcon";
import { SigninLink } from "./SignInLinks";

export default function Input() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const PasswordIcon = showPassword ? Eye : EyeOff;
  const ConfirmPasswordIcon = showConfirmPassword ? Eye : EyeOff;

  const {
    name,
    setName,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    isNameError,
    isUsernameError,
    isEmailError,
    isPasswordError,
    isConfirmPasswordError,
    isGeneralError,
    clearErrorOnChange,
    handleSubmit,
  } = useSignupForm();

  return (
    <form
      className="absolute inset-x-0 bottom-0 top-79.5 z-20 overflow-visible bg-white px-6 pb-4 pt-5 shadow-2xl shadow-lime-950/10"
      onSubmit={handleSubmit}
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
          <span className="flex h-10 items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <User className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Нэр"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearErrorOnChange();
              }}
              disabled={isLoading}
            />
          </span>
          {isNameError && (
            <p className="mt-1 text-[11px] font-medium text-red-500 pl-1">
              {error}
            </p>
          )}
        </label>

        <label className="block">
          <span className="flex h-10 items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <Phone className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Утас"
              type="tel"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearErrorOnChange();
              }}
              disabled={isLoading}
            />
          </span>
          {isUsernameError && (
            <p className="mt-1 text-[11px] font-medium text-red-500 pl-1">
              {error}
            </p>
          )}
        </label>

        <label className="block">
          <span className="flex h-10 items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <Mail className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Таны имэйл хаяг"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearErrorOnChange();
              }}
              disabled={isLoading}
            />
          </span>
          {isEmailError && (
            <p className="mt-1 text-[11px] font-medium text-red-500 pl-1">
              {error}
            </p>
          )}
        </label>

        <label className="block">
          <span className="flex h-10 items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <Lock className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Нууц үг"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrorOnChange();
              }}
              disabled={isLoading}
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
          {isPasswordError && (
            <p className="mt-1 text-[11px] font-medium text-red-500 pl-1">
              {error}
            </p>
          )}
        </label>

        <label className="block">
          <span className="flex h-10 items-center gap-3 rounded-[14px] border border-zinc-200 px-2.5">
            <FieldIcon>
              <Lock className="h-5 w-5 text-lime-600" />
            </FieldIcon>
            <input
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
              placeholder="Нууц үг давтах"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearErrorOnChange();
              }}
              disabled={isLoading}
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
          {isConfirmPasswordError && (
            <p className="mt-1 text-[11px] font-medium text-red-500 pl-1">
              {error}
            </p>
          )}
        </label>
      </div>

      <label className="relative z-10 mt-2.5 flex items-start gap-3 text-[12px] font-semibold leading-5 text-zinc-500">
        <input
          className="mt-1 h-5 w-5 shrink-0 rounded border-zinc-300 accent-lime-600"
          type="checkbox"
          required
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

      {isGeneralError && (
        <p className="relative z-10 mt-2 text-left text-[11px] font-semibold text-red-500 pl-1">
          {error}
        </p>
      )}

      <button
        className="relative z-10 mt-3 flex h-12 w-full items-center justify-center rounded-[17px] bg-lime-600 text-[20px] font-bold text-white shadow-lg shadow-lime-600/25 disabled:bg-zinc-400 disabled:shadow-none"
        type="submit"
        disabled={isLoading}
      >
        <span className="flex-1 text-center">
          {isLoading ? "Уншиж байна..." : "Бүртгүүлэх"}
        </span>
      </button>

      <SigninLink />
    </form>
  );
}
