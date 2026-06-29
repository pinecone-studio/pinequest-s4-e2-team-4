"use client";

import { validateLoginForm } from "@/utils/validator";
import axios from "axios";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useState } from "react";
import { ErrorFlags } from "../utils/types";

export function useLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignupTransitioning, setIsSignupTransitioning] = useState(false);

  const clearError = () => {
    if (error) setError(null);
  };

  const errorFlags: ErrorFlags = {
    isEmailError: Boolean(
      error &&
      (error.toLowerCase().includes("имэйл") ||
        error.toLowerCase().includes("олдсонгүй") ||
        error.toLowerCase().includes("бүртгэлгүй")),
    ),
    isPasswordError: Boolean(
      error &&
      (error.toLowerCase().includes("нууц") ||
        error.toLowerCase().includes("буруу") ||
        error.toLowerCase().includes("password")),
    ),
    isGeneralError: false,
  };

  errorFlags.isGeneralError = Boolean(
    error && !errorFlags.isEmailError && !errorFlags.isPasswordError,
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true },
      );
      if (res.status === 200 || res.status === 201) {
        router.push("/trips");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Нэвтрэхэд алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isSignupTransitioning) return;
    setIsSignupTransitioning(true);
    window.setTimeout(() => router.push("/signup"), 420);
  };

  return {
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
  };
}
