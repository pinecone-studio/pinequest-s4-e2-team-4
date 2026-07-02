"use client";
 
import { motion } from "framer-motion";
 
const stats = [
  { value: "3 мин", label: "Дундаж маршрут үүсэх хугацаа" },
  { value: "500+", label: "Бэлэн байршил, аяллын чиглэл" },
  { value: "24/7", label: "AI туслахын дэмжлэг" },
];
 
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};
 
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
 
export default function About() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-28">
      <div className="grid gap-16 lg:grid-cols-2 items-center">
        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative"
        >
          <img
            src="tuguldur-baatar--NtLX05El5M-unsplash.jpg"
            alt="Монголын байгалийн үзэсгэлэнт газар"
            className="rounded-3xl shadow-xl object-cover w-full h-[520px]"
          />
 
          {/* small info card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="absolute -bottom-6 left-6 rounded-2xl bg-white p-5 shadow-xl border"
          >
            <p className="text-2xl font-bold text-teal-700">AI</p>
            <p className="text-sm text-gray-600">
              Ухаалаг маршрут төлөвлөлт
            </p>
          </motion.div>
        </motion.div>
 
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col justify-center"
        >
          <span className="mb-4 w-fit rounded-full bg-teal-100 px-4 py-2 text-xs font-semibold text-teal-700">
            ЯАГААД MONTRIP
          </span>
 
          <h2 className="mb-6 text-5xl font-bold text-gray-800 leading-tight">
            Зүгээр л маршрут биш,
            <br />
            танд тохирсон шийдэл
          </h2>
 
          <p className="mb-10 text-gray-600 leading-relaxed">
            Бид ерөнхий загвар санал болгодоггүй. Таны төсөв, чөлөөт
            хугацаа, сонирхож буй газруудад тулгуурлан MonTrip
            маршрут бүрийг таны хувийн шаардлагад тохируулж бүтээдэг.
          </p>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="grid grid-cols-3 gap-6"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={item}>
                <p className="text-3xl font-bold text-teal-700">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500 leading-snug">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}