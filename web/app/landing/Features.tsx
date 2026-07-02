"use client";
 
import { motion } from "framer-motion";
import FeatureCard from "./FeaturesCard";
 
export default function Features() {
  const features = [
    {
      title: "Хиймэл оюунтай маршрут төлөвлөлт",
      description:
        "Таны зорчих чиглэл, хугацаа, сонирхолд тулгуурлан аяллын маршрутыг автоматаар үүсгэнэ.",
    },
    {
      title: "Зардлын ухаалаг тооцоолуур",
      description:
        "Түлш, байр, хоолны зардлыг урьдчилан тооцоолж аяллыг илүү хялбар болгоно.",
    },
    {
      title: "Хялбар навигаци",
      description:
        "Интерактив газрын зураг ашиглан замаа хянаж, аяллаа зөв удирдана.",
    },
  ];
 
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-700 leading-tight">
          Орчин үеийн аялагчдад зориулсан
          <br />
          ухаалаг систем
        </h2>
 
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          MonTrip нь таны аяллыг төлөвлөх, удирдах, зардлыг тооцоолох
          бүх процессыг нэг дор хялбарчилна.
        </p>
      </motion.div>
 
      {/* features grid */}
      <div className="grid gap-8 text-gray-600 md:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}