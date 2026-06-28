"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#f7f4ed]">
      <Image
        src="/khuvsgul-lake.jpg"
        alt="Khuvsgul lake"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#f7f4ed]/95 via-[#f7f4ed]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#f7f4ed]/25 via-transparent to-transparent" />

  
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="absolute left-0 top-0 z-30 flex w-full items-center justify-between px-20 py-8"
      >
        <div className="text-xl font-bold text-[#3f5518]">MonTrip</div>

        <div className="flex gap-8 text-sm text-black/70">
          <span>Нүүр</span>
          <span>Асуудал</span>
          <span>Шийдэл</span>
          <span>AI Demo</span>
          <span>Баг</span>
        </div>
      </motion.nav>

   
      <motion.img
        src="/cloud-left.png"
        alt="cloud left"
        initial={{ x: 0, opacity: 1, scale: 1.15 }}
        animate={{ x: "-85vw", opacity: 0, scale: 1.35 }}
        transition={{
          duration: 3,
          delay: 0.4,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="pointer-events-none absolute left-[-10%] top-[-15%] z-50 h-[130vh] w-[75vw] object-cover"
      />

  
      <motion.img
        src="/cloud-right.png"
        alt="cloud right"
        initial={{ x: 0, opacity: 1, scale: 1.15 }}
        animate={{ x: "85vw", opacity: 0, scale: 1.35 }}
        transition={{
          duration: 3,
          delay: 0.4,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="pointer-events-none absolute right-[-10%] top-[-15%] z-50 h-[130vh] w-[75vw] object-cover"
      />

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2, delay: 1.6 }}
        className="pointer-events-none absolute inset-0 z-40 bg-white/30 backdrop-blur-sm"
      />


      <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 2.7 }}
        className="relative z-20 flex h-full flex-col justify-center px-24"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          className="mb-4 font-semibold tracking-widest text-[#4d641f]"
        >
          AI TRAVEL PLANNER
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.2 }}
          className="text-8xl font-black tracking-tight text-[#3f5518]"
        >
          MonTrip
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.4 }}
          className="mt-6 max-w-xl text-2xl leading-snug text-black"
        >
          Монголд аялах хамгийн тохиромжтой газрыг{" "}
          <span className="font-bold text-[#4d641f]">AI</span> санал болгоно
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.55 }}
          className="mt-4 max-w-lg text-base leading-relaxed text-black/60"
        >
          Хувийн сонирхол, төсөв, хугацаанд тохирсон аяллын маршрутыг ухаалгаар
          төлөвлөнө.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.7 }}
          className="mt-8 flex gap-4"
        >
          <button className="rounded-full bg-[#4d641f] px-8 py-4 text-white shadow-xl transition hover:scale-105">
            Demo үзэх →
          </button>

          <button className="rounded-full border border-[#4d641f] px-8 py-4 text-[#4d641f] transition hover:scale-105 hover:bg-white/60">
            Илүү их мэдэх →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 4 },
            y: { repeat: Infinity, duration: 1.4 },
          }}
          className="absolute bottom-10 left-24 text-sm text-black/60"
        >
          ↓ Scroll to explore
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;