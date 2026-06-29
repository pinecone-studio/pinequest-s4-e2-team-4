import { Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";

interface PasswordFieldProps {
  value: string;
  error: string | null;
  isLoading: boolean;
  showPassword: boolean;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}

export function PasswordField({
  value,
  error,
  isLoading,
  showPassword,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  const VisibilityIcon = showPassword ? Eye : EyeOff;

  return (
    <>
      <label className="relative z-10 mt-3 block text-[14px] font-bold text-zinc-950">
        Нууц үг
        <span className="mt-1 flex h-12 items-center gap-3 rounded-2xl border border-zinc-200 px-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-lime-50">
            <Lock className="h-5 w-5 text-lime-600" />
          </span>
          <input
            className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
            placeholder="Нууц үгээ оруулна уу"
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
          />
          <button
            aria-label="Нууц үг харах"
            className="text-zinc-400"
            onClick={onToggleVisibility}
            type="button"
          >
            <VisibilityIcon className="h-5 w-5 text-lime-600" />
          </button>
        </span>
        {error && (
          <p className="mt-1 pl-1 text-[11px] font-medium text-red-500">
            {error}
          </p>
        )}
      </label>

      <div className="relative z-10 mt-2 text-right">
        <Link
          className="text-[14px] font-bold text-lime-600"
          href="/forgot-password"
        >
          Нууц үг мартсан уу?
        </Link>
      </div>
    </>
  );
}
