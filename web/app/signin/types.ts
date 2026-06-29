export interface LoginFormState {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  error: string | null;
  isSignupTransitioning: boolean;
}

export interface ErrorFlags {
  isEmailError: boolean;
  isPasswordError: boolean;
  isGeneralError: boolean;
}
