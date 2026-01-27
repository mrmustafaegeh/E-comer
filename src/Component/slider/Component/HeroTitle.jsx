"use client";

import { motion } from "framer-motion";

const HeroTitle = () => {
  return (
    <div className="space-y-4">
      {/* ✅ LCP ELEMENT — STATIC H1 */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white">
        Discover the{" "}
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Future of
        </span>{" "}
        Shopping
      </h1>

      {/* ✅ NON-LCP — animated AFTER paint */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0"
      >
        Premium tech products with unbeatable deals. From cutting-edge
        electronics to lifestyle essentials.
      </motion.p>
    </div>
  );
};

export default HeroTitle;
