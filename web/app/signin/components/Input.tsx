"use client";

import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function Input() {
  const [showPassword, setShowPassword] = useState(false);
  const PasswordIcon = showPassword ? Eye : EyeOff;

  return (
    <form
      className="absolute inset-x-0 bottom-0 top-[430px] z-20 rounded-t-[42px] bg-white px-6 pb-4 pt-4 shadow-2xl shadow-lime-950/10 "
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="mb-2.5 flex items-center gap-3">
       
        <div>
      
          <p className="mt-0.5 text-[13px] font-medium leading-5 text-zinc-500">
           Нэвтрэхийн тулд мэдээллээ оруулна уу
          </p>
        </div>
      </div>

      <label className="block text-[14px] font-bold text-zinc-950">
       Нэвтрэх нэр
        <span className="mt-1 flex h-[48px] items-center gap-3 rounded-[16px] border border-zinc-200 px-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-lime-50">
            <Mail className="h-5 w-5 text-lime-600" />
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
            placeholder="Таны утас эсвэл имэйл хаяг"
            type="text"
          />
        </span>
      </label>

      <label className="mt-3 block text-[14px] font-bold text-zinc-950">
        Нууц үг
        <span className="mt-1 flex h-[48px] items-center gap-3 rounded-[16px] border border-zinc-200 px-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-lime-50">
            <Lock className="h-5 w-5 text-lime-600" />
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
            placeholder="Нууц үгээ оруулна уу"
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label="Нууц үг харах"
            className="text-zinc-400"
            onClick={() => setShowPassword((value) => !value)}
            type="button"
          >
            <PasswordIcon className="h-5 w-5 text-lime-600" />
          </button>
        </span>
      </label>

      <div className="mt-2 text-right">
        <Link className="text-[14px] font-bold text-lime-600" href="/forgot-password">
          Нууц үг мартсан уу?
        </Link>
      </div>

      <button
        className="mt-4 flex h-[50px] w-full items-center justify-center rounded-[17px] bg-lime-600 text-[20px] font-bold text-white shadow-lg shadow-lime-600/25"
        type="submit"
      >
        <span className="flex-1 text-center">Нэвтрэх</span>
        {/* <ArrowRight className="mr-5 h-6 w-6" /> */}
      </button>

      <p className="mt-4 text-center text-[15px] font-medium text-zinc-500">
        Бүртгэл байхгүй юу?{" "}
        <Link className="font-bold text-lime-600" href="/signup">
          Бүртгүүлэх
        </Link>
      </p>
    </form>
  );
}
