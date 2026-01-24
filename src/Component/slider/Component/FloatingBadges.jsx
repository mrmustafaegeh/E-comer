"use client";
import { motion } from "framer-motion";

const FloatingBadges = () => {
  return (
    <>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-xl"
      >
        🔥 Hot Deal
      </motion.div>

      <motion.div
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        className="absolute -bottom-4 -left-4 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-xl"
      >
        ⚡ Fast Ship
      </motion.div>
    </>
  );
};
export default FloatingBadges;
