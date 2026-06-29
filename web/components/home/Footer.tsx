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
    <footer className="border-t border-slate-100 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-950/5 sm:px-6">
      <nav className="grid grid-cols-4 gap-2">
        {footerItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href === "/home" && pathname === "/");

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-14 flex-col items-center justify-center rounded-2xl text-[11px] font-bold transition-all duration-200 ${
                active
                  ? "bg-[#efefef] text-[#1b9bd7]  scale-102"
                  : "text-slate-500 hover:bg-slate-50 active:scale-95"
              }`}
            >
              <Icon
                size={20} 
                strokeWidth={active ? 2.5 : 2} 
                className="transition-transform duration-200"
              />
              <span className="mt-1 font-medium tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}