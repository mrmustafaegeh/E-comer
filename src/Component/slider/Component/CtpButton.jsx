"use client";
import { motion } from "framer-motion";
const CTAButtons = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
    >
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)",
        }}
        whileTap={{ scale: 0.95 }}
        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Shop Now
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </motion.svg>
        </span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
          initial={{ x: "-100%" }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 transition-all"
      >
        Browse Collection
      </motion.button>
    </motion.div>
  );
};
export default CTAButtons;
