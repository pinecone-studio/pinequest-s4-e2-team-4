"use client";
 
import { motion } from "framer-motion";
 
interface FeatureCardProps {
  title: string;
  description: string;
  index?: number;
}
 
export default function FeatureCard({
  title,
  description,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="group rounded-3xl bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      {/* small glow effect */}
      <div className="mb-5 h-1 w-12 rounded-full bg-teal-500 transition-all group-hover:w-20" />
 
      {/* title */}
      <h3 className="mb-3 text-xl font-semibold text-gray-800 group-hover:text-teal-700 transition">
        {title}
      </h3>
 
      {/* description */}
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
 