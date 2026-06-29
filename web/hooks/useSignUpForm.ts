"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  getSignupErrorField,
  SIGNUP_ERRORS,
  validateSignupForm,
} from "../utils/validator";

export function useSignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    isNameError,
    isUsernameError,
    isEmailError,
    isPasswordError,
    isConfirmPasswordError,
    isGeneralError,
  } = getSignupErrorField(error);

  const clearErrorOnChange = () => {
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validationError = validateSignupForm({
      name,
      username,
      email,
      password,
      confirmPassword,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post("/api/auth/register", {
        email,
        password,
        name,
        username,
      });

      if (res.status === 200 || res.status === 201) {
        router.push("/signin");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || SIGNUP_ERRORS.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}
