"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeBackdrop from "@/components/home/HomeBackdrop";
import PhoneFrame from "@/components/home/PhoneFrame";
import { Lock, Mail, KeyRound, ChevronLeft, Loader2 } from "lucide-react";
import { useLanguage } from "@/app/lib/language";

type PasswordApiResponse = {
  error?: string;
  message?: string;
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t =
    language === "en"
      ? {
          title: "Reset password",
          back: "Back",
          intro: "Enter your email to get a code and update your password.",
          enterEmailFirst: "Please enter your email first.",
          sendCodeError: "Failed to send code",
          codeSent: "Verification code sent to your email.",
          genericError: "Something went wrong",
          passwordUpdated: "Password updated successfully.",
          email: "Email address",
          getCode: "Get code",
          code: "Verification code",
          codePlaceholder: "Enter your code",
          newPassword: "New password",
          submitting: "Updating...",
          submit: "Update password",
          seconds: "s",
        }
      : {
          title: "Нууц үг сэргээх",
          back: "Буцах",
          intro: "Имэйлээ оруулан код авч, нууц үгээ шинэчилнэ үү.",
          enterEmailFirst: "Эхлээд имэйл хаягаа оруулна уу!",
          sendCodeError: "Код илгээхэд алдаа гарлаа",
          codeSent: "Баталгаажуулах кодыг имэйл рүү илгээлээ.",
          genericError: "Алдаа гарлаа",
          passwordUpdated: "Нууц үг амжилттай шинэчлэгдлээ.",
          email: "Имэйл хаяг",
          getCode: "Код авах",
          code: "Баталгаажуулах код",
          codePlaceholder: "Кодоо оруулна уу",
          newPassword: "Шинэ нууц үг",
          submitting: "Шинэчилж байна...",
          submit: "Нууц үг шинэчлэх",
          seconds: "с",
        };
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSendCode = async () => {
    if (!formData.email) {
      setMessage({ type: "error", text: t.enterEmailFirst });
      return;
    }

    setSendingCode(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/auth/forgot-password", {
     
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = (await response.json()) as PasswordApiResponse;

      if (!response.ok) {
        throw new Error(language === "en" ? t.sendCodeError : data.error || t.sendCodeError);
      }

      setMessage({
        type: "success",
        text: t.codeSent,
      });
      setTimer(60); 
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : t.sendCodeError,
      });
    } finally {
      setSendingCode(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as PasswordApiResponse;

      if (!response.ok) {
        throw new Error(language === "en" ? t.genericError : data.error || t.genericError);
      }

      setMessage({
        type: "success",
        text: language === "en" ? t.passwordUpdated : data.message || t.passwordUpdated,
      });
      setFormData({ email: "", code: "", newPassword: "" });
    } catch (err: unknown) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : t.genericError,
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.email && formData.code && formData.newPassword;

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <HomeBackdrop active={true} />
      <div className="relative z-10">
        <PhoneFrame>
          <div className="h-[95%] flex flex-col bg-gray-50">
     
            <div className="bg-[#1e3a2f] text-white pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-semibold tracking-wide">
                  {t.title}
                </h1>
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="flex items-center text-sm text-gray-300 hover:text-white transition"
                >
                  <ChevronLeft className="w-4 h-4" /> {t.back}
                </button>
              </div>
              <p className="text-xs text-gray-300 text-center max-w-[220px] mx-auto">
                {t.intro}
              </p>
            </div>

          
            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
            
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
           
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2.5 bg-blue-50 rounded-xl text-blue-500 flex-shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="block text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                          {t.email}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="example@gmail.com"
                          className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-800 placeholder-gray-300 mt-0.5 outline-none"
                          required
                        />
                      </div>
                    </div>

                 
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={!formData.email || sendingCode || timer > 0}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all flex-shrink-0 ${
                        formData.email && !sendingCode && timer === 0
                          ? "bg-emerald-50 text-[#1e3a2f] hover:bg-emerald-100 active:scale-95"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {sendingCode ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : timer > 0 ? (
                        `${timer}${t.seconds}`
                      ) : (
                        t.getCode
                      )}
                    </button>
                  </div>

                  
                  <div className="p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        {t.code}
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder={t.codePlaceholder}
                        className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-800 placeholder-gray-300 mt-0.5 outline-none"
                        required
                      />
                    </div>
                  </div>

    
                  <div className="p-4 flex items-center gap-4">
                    <div className="p-2.5 bg-purple-50 rounded-xl text-purple-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        {t.newPassword}
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 text-gray-800 placeholder-gray-300 mt-0.5 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

       
                {message.text && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-medium text-center transition-all ${
                      message.type === "success"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

           
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex justify-center items-center gap-2 ${
                      isFormValid && !loading
                        ? "bg-[#1e3a2f] text-white shadow-md hover:bg-[#152921] active:scale-[0.99]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t.submitting}
                      </>
                    ) : (
                      t.submit
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
