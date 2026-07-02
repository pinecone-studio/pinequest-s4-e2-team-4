"use client";
 
import { motion } from "framer-motion";
 
interface DestinationCardProps {
  image: string;
  title: string;
  index?: number;
}
 
export default function DestinationCard({
  image,
  title,
  index = 0,
}: DestinationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="group cursor-pointer"
    >
      {/* image */}
      <div className="overflow-hidden rounded-2xl shadow-md">
        <img
          src={image}
          alt={title}
          className="h-60 w-full object-cover transition duration-700 group-hover:scale-110"
        />
      </div>
 
      {/* content */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="font-medium text-gray-800">{title}</span>
 
        <button className="text-xs font-medium text-teal-700 hover:text-teal-900 hover:underline transition">
          Маршрут үүсгэх →
        </button>
      </div>
    </motion.div>
  );
}
 