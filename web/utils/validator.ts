export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=]).{8,}$/;
  return strongPasswordRegex.test(password);
};

export const validateLoginForm = (
  email: string,
  password: string,
): { isValid: boolean; error: string | null } => {
  if (!validateEmail(email)) {
    return { isValid: false, error: "Зөв имэйл хаяг оруулна уу!" };
  }

  if (!validatePassword(password)) {
    return {
      isValid: false,
      error:
        "Нууц үг дор хаяж 8 тэмдэгт урттай, 1 том үсэг, 1 тоо болон 1 тусгай тэмдэгт агуулсан байх ёстой!",
    };
  }

  return { isValid: true, error: null };
};

export const SIGNUP_ERRORS = {
  NAME_REQUIRED: "Нэр оруулна уу",
  USERNAME_REQUIRED: "Утасны дугаар оруулна уу",
  EMAIL_REQUIRED: "Имэйл хаяг оруулна уу",
  PASSWORD_REQUIRED: "Нууц үг оруулна уу",
  PASSWORD_MISMATCH: "Нууц үг давтах хэсэг зөрүүтэй байна",
  GENERIC: "Бүртгүүлэхэд алдаа гарлаа",
} as const;

export type SignupFormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function validateSignupForm({
  name,
  username,
  email,
  password,
  confirmPassword,
}: SignupFormValues): string | null {
  if (!name.trim()) {
    return SIGNUP_ERRORS.NAME_REQUIRED;
  }
  if (!username.trim()) {
    return SIGNUP_ERRORS.USERNAME_REQUIRED;
  }
  if (!email.trim()) {
    return SIGNUP_ERRORS.EMAIL_REQUIRED;
  }
  if (!password) {
    return SIGNUP_ERRORS.PASSWORD_REQUIRED;
  }
  if (password !== confirmPassword) {
    return SIGNUP_ERRORS.PASSWORD_MISMATCH;
  }

  return null;
}

export function getSignupErrorField(error: string | null) {
  const isNameError = !!error && error.includes("Нэр");
  const isUsernameError =
    !!error &&
    (error.includes("Утас") || error.toLowerCase().includes("нэвтрэх нэр"));
  const isEmailError = !!error && error.toLowerCase().includes("имэйл");
  const isPasswordError =
    !!error &&
    error.toLowerCase().includes("нууц үг") &&
    !error.includes("давтах") &&
    !error.includes("зөрүүтэй");
  const isConfirmPasswordError =
    !!error && (error.includes("давтах") || error.includes("зөрүүтэй"));
  const isGeneralError =
    !!error &&
    !isNameError &&
    !isUsernameError &&
    !isEmailError &&
    !isPasswordError &&
    !isConfirmPasswordError;

  return {
    isNameError,
    isUsernameError,
    isEmailError,
    isPasswordError,
    isConfirmPasswordError,
    isGeneralError,
  };
}
