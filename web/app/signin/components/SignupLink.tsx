import Link from "next/link";
import type { MouseEvent } from "react";

interface SignupLinkProps {
  isTransitioning: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function SignupLink({ isTransitioning, onClick }: SignupLinkProps) {
  return (
    <p className="relative z-10 mt-4 text-center text-[15px] font-medium text-zinc-500">
      Бүртгэл байхгүй юу?{" "}
      <Link
        aria-disabled={isTransitioning}
        className={`relative inline-flex overflow-hidden rounded-full px-1 font-bold text-lime-600 transition-colors duration-300 ${
          isTransitioning ? "pointer-events-none text-white" : ""
        }`}
        href="/signup"
        onClick={onClick}
      >
        <span
          className={`absolute inset-0 -z-10 rounded-full bg-lime-600 transition-transform duration-300 ${
            isTransitioning ? "scale-x-100" : "scale-x-0"
          } origin-left`}
        />
        <span className="relative">Бүртгүүлэх</span>
      </Link>
    </p>
  );
}
