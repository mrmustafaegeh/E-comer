"use client";
import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Products" },
    { value: "24/7", label: "Support" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
      className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 + idx * 0.1 }}
          className="text-center lg:text-left"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            {stat.value}
          </motion.div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};
export default StatsSection;
