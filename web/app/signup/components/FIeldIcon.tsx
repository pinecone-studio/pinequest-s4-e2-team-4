import type { ReactNode } from "react";

export function FieldIcon({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] bg-lime-50">
      {children}
    </span>
  );
}
