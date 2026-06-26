"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Map, User } from "lucide-react";

const footerItems = [
  { label: "Нүүр", icon: Home, href: "/home" },
  { label: "AI Chat", icon: MessageCircle, href: "/chat" },
  { label: "Маршрут", icon: Map, href: "/route" },
  { label: "Профайл", icon: User, href: "/profile" },
] as const;

export default function HomeFooter() {
  const pathname = usePathname();

  return (
    <footer className="border-t border-slate-200 bg-white/95 px-3 pb-3 pt-2 backdrop-blur">
      <nav className="grid grid-cols-4 gap-1">
        {footerItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-14 flex-col items-center justify-center rounded-2xl text-xs font-bold transition ${
                active
                  ? "bg-[#e6fffa] text-[#0b7f71] scale-105"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <Icon
                size={17}
                strokeWidth={2}
                className={active ? "text-[#0b7f71]" : ""}
              />
              <span className="mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
