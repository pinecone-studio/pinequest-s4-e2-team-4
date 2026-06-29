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
