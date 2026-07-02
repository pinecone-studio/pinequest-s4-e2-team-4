"use client";
 
import { motion } from "framer-motion";
import DestinationCard from "./Destination";
 
const destinations = [
  {
    title: "Хөвсгөл нуур",
    image: "sodo-sane-eDcdGQRSVj8-unsplash.jpg",
  },
  {
    title: "Говь цөл",
    image: "usukhbayar-gankhuyag-fjCihZthrAo-unsplash.jpg",
  },
  {
    title: "Горхи-Тэрэлж",
    image: "adil-edin-GUwlwDVQN_g-unsplash.jpg",
  },
  {
    title: "Алтай Таван Богд",
    image: "konstantin-dyadyun-7-6Fhdc2LJc-unsplash.jpg",
  },
];
 
export default function DestinationGallery() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
      >
        <div>
          <p className="text-sm text-gray-500">Аяллын бүсүүд</p>
 
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-700 leading-tight">
            Монголын үзэсгэлэнт
            <br />
            газруудыг олж мэдээрэй
          </h2>
        </div>
 
        <button className="self-start md:self-auto rounded-full border px-6 py-2 text-sm hover:bg-gray-50 active:scale-95 transition">
          Бүх бүсийг үзэх →
        </button>
      </motion.div>
 
      {/* grid */}
      <div className="grid gap-6 text-gray-600 md:grid-cols-4">
        {destinations.map((item, index) => (
          <DestinationCard key={item.title} {...item} index={index} />
        ))}
      </div>
    </section>
  );
}