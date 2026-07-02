"use client";
 
import { motion } from "framer-motion";
 
export default function CTASection() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[28px] group"
      >
        {/* background image */}
        <img
          src="bolatbek-gabiden-ogoOCZ9SdYw-unsplash.jpg"
          alt="Монголын байгаль"
          className="h-[380px] w-full object-cover scale-105 group-hover:scale-110 transition duration-700"
        />
 
        {/* overlay */}
        <div className="absolute inset-0 bg-black/50" />
 
        {/* content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <p className="mb-3 text-sm tracking-wide text-white/80">
            Мөрөөдлийн аяллаа хойшлуулах хэрэггүй
          </p>
 
          <h2 className="max-w-2xl text-3xl md:text-4xl font-semibold leading-snug">
            Дараагийн адал явдал
            <br />
            яг энд эхэлнэ
          </h2>
 
          <p className="mt-4 max-w-xl text-sm text-white/70">
            Хаана, хэзээ, хэдэн төгрөгөөр гэдгээ бидэнд хэлээрэй —
            үлдсэнийг MonTrip зохион байгуулна.
          </p>
 
          <button className="mt-8 rounded-full bg-orange-500 px-10 py-4 font-medium hover:bg-orange-600 active:scale-95 transition">
            Аяллаа эхлүүлэх →
          </button>
        </div>
      </motion.div>
    </section>
  );
}