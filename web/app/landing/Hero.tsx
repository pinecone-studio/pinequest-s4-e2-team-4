"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
  <section className="relative h-[85vh] overflow-hidden">

      {/* background image */}
 <img
  src="dembee-tsogoo-PU_hcOj2rFI-unsplash.jpg"
  alt="Монголын байгаль"
  className="absolute inset-0 h-full w-full object-cover object-[center_50%]"
/>
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* content */}
      <div className="relative mx-auto flex h-full max-w-7x flex-col items-center justify-center px-8 text-center text-white">

        {/* badge */}
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 rounded-full bg-white/10 px-4 py-2 text-xs backdrop-blur"
        >
          AI аяллын маршрут төлөвлөгч
        </motion.span>

        {/* title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="max-w-4xl text-5xl md:text-6xl font-bold leading-tight"
        >
          Монгол орны аяллаа
          <br />
          <span className="text-teal-300">ухаалгаар төлөвлөөрэй</span>
        </motion.h1>

        {/* description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-6 max-w-2xl text-base md:text-lg text-gray-200"
        >
          MonTrip нь таны төсөв, хугацаа, сонирхолд тулгуурлан
          хиймэл оюун ашиглан хамгийн оновчтой аяллын маршрутыг
          хэдхэн секундын дотор гаргаж өгнө.
        </motion.p>

        {/* buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >

          <button className="rounded-full bg-teal-700 px-8 py-4 font-medium hover:bg-teal-800 active:scale-95 transition">
            Аяллаа эхлүүлэх →
          </button>

          <button className="rounded-full bg-white px-8 py-4 text-black hover:bg-gray-100 active:scale-95 transition">
            Дэлгэрэнгүй
          </button>

        </motion.div>

      </div>
    </section>
  );
}
// pinequest-s4-e2-team-4 