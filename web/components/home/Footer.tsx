// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, MessageCircle, Map, User } from "lucide-react";

// const footerItems = [
//   { label: "Нүүр", icon: Home, href: "/home" },
//   { label: "AI Chat", icon: MessageCircle, href: "/chat" },
//   { label: "Маршрут", icon: Map, href: "/route" },
//   { label: "Профайл", icon: User, href: "/profile" },
// ] as const;

// export default function HomeFooter() {
//   const pathname = usePathname();

//   return (
//     <footer className="border-t border-slate-100 bg-white/95 px-4 pb-2 pt-2 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-950/5 sm:px-6 flex flex-col gap-2">
//       {/* Навигацийн цэс */}
//       <nav className="grid grid-cols-4 gap-2">
//         {footerItems.map((item) => {
//           const Icon = item.icon;
//           const active =
//             pathname === item.href ||
//             (item.href === "/home" && pathname === "/");

//           return (
//             <Link
//               key={item.label}
//               href={item.href}
//               className={`flex h-14 flex-col items-center justify-center rounded-2xl text-[11px] font-bold transition-all duration-200 ${
//                 active
//                   ? "bg-[#eafaf1] text-[#0A4429] scale-102"
//                   : "text-slate-500 hover:bg-slate-50 active:scale-95"
//               }`}
//             >
//               <Icon
//                 size={20}
//                 strokeWidth={active ? 2.5 : 2}
//                 className="transition-transform duration-200"
//               />
//               <span className="mt-1 font-medium tracking-tight">
//                 {item.label}
//               </span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* iPhone Home Indicator (Цагаан/Саарал зураас) */}
//       <div className="flex justify-center items-center pt-1 pb-1">
//         <Link
//           href="/homescreen"
//           className="w-36 h-[5px] bg-slate-300 rounded-full transition-all duration-200 hover:bg-slate-400 active:scale-95 block"
//           aria-label="Home Screen"
//         />
//       </div>
//     </footer>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, MessageCircle, Map, User } from "lucide-react";
import { useLanguage } from "@/app/lib/language";

const footerItems = [
  { label: { mn: "Нүүр", en: "Home" }, icon: Home, href: "/home" },
  { label: { mn: "AI Chat", en: "AI Chat" }, icon: MessageCircle, href: "/chat" },
  { label: { mn: "Маршрут", en: "Route" }, icon: Map, href: "/route" },
  { label: { mn: "Профайл", en: "Profile" }, icon: User, href: "/profile" },
] as const;

export default function HomeFooter() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const goHomeScreen = () => {
    const navigate = () => router.push("/homescreen");
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => navigate());
    } else {
      navigate();
    }
  };

  return (
    <footer className="border-t border-slate-100 bg-white/95 px-4 pb-2 pt-2 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-950/5 sm:px-6 flex flex-col gap-2">
      <nav className="grid grid-cols-4 gap-2">
        {footerItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href === "/home" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-14 flex-col items-center justify-center rounded-2xl text-[11px] font-bold transition-all duration-200 ${
                active
                  ? "bg-[#eafaf1] text-[#0A4429] scale-102"
                  : "text-slate-500 hover:bg-slate-50 active:scale-95"
              }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                className="transition-transform duration-500"
              />
              <span className="mt-1 font-medium tracking-tight">
                {item.label[language]}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* iPhone Home Indicator */}
      <div className="flex justify-center items-center pt-1 pb-1">
        <button
          type="button"
          onClick={goHomeScreen}
          aria-label="Home Screen"
          className="w-36 h-[5px] bg-slate-300 rounded-full transition-all duration-300 hover:bg-slate-400 active:scale-95 block"
        />
      </div>
    </footer>
  );
}
