import { Mail } from "lucide-react";

interface EmailFieldProps {
  value: string;
  error: string | null;
  isLoading: boolean;
  onChange: (value: string) => void;
}

export function EmailField({
  value,
  error,
  isLoading,
  onChange,
}: EmailFieldProps) {
  return (
    <label className="relative z-10 block text-[14px] font-bold text-zinc-950">
      Нэвтрэх нэр
      <span className="mt-1 flex h-12 items-center gap-3 rounded-2xl border border-zinc-200 px-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-lime-50">
          <Mail className="h-5 w-5 text-lime-600" />
        </span>
        <input
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-zinc-700 outline-none placeholder:text-zinc-400"
          placeholder="Таны утас эсвэл имэйл хаяг"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
        />
      </span>
      {error && (
        <p className="mt-1 pl-1 text-[11px] font-medium text-red-500">
          {error}
        </p>
      )}
    </label>
  );
}
