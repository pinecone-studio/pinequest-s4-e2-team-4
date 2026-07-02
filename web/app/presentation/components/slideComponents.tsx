import Image from "next/image";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { olive } from "./presentationData";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function IconBadge({ icon: Icon, color = olive }: { icon: LucideIcon; color?: string }) {
  return (
    <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_12px_30px_rgba(31,43,34,0.18)]">
      <Icon className="h-11 w-11" style={{ color }} strokeWidth={2.7} />
    </div>
  );
}

export function PhotoPanel({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-xl shadow-[0_26px_60px_rgba(31,43,34,0.2)] ${className}`}
    >
      <Image src={src} alt={alt} fill priority={priority} className="object-cover" sizes="80vw" />
    </motion.div>
  );
}

export function SlideShell({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "photo";
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 32, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.985 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`relative h-full w-full overflow-hidden rounded-[10px] ${
        tone === "photo" ? "bg-[#26331d] text-white" : "bg-[#f5f1e9] text-[#1f2b22]"
      } shadow-[0_30px_90px_rgba(10,25,16,0.28)]`}
    >
      {children}
    </motion.section>
  );
}

export function SlideTitle({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <motion.h2
      variants={fadeUp}
      initial="hidden"
      animate="show"
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`text-5xl font-black uppercase leading-none md:text-7xl ${
        light ? "text-white" : "text-[#708139]"
      }`}
    >
      {children}
    </motion.h2>
  );
}

export function Gauge({ value, label, color, index }: { value: number; label: string; color: string; index: number }) {
  const rotation = (value / 100) * 180;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 + index * 0.1 }}
      className="flex min-h-44 flex-col items-center justify-center"
    >
      <div className="relative h-24 w-44 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-44 rounded-t-full border-[14px] border-[#dfe4df]" />
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.1, delay: 0.4 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-0 h-44 w-44 origin-bottom-right rounded-t-full border-[14px] border-transparent"
          style={{ borderLeftColor: color, borderTopColor: color }}
        />
        <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 text-4xl font-semibold text-black">
          {value}%
        </div>
      </div>
      <p className="mt-5 max-w-44 text-center text-2xl font-black uppercase leading-tight" style={{ color }}>
        {label}
      </p>
    </motion.div>
  );
}
