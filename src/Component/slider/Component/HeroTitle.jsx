"use client";

import { motion } from "framer-motion";

const HeroTitle = () => {
  return (
    <div className="space-y-4">
      {/* ✅ LCP ELEMENT — STATIC H1 */}
      {/* ✅ LCP ELEMENT — STATIC H1 */}
      <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tighter text-gray-900 leading-[0.95]">
        The Future of <br className="hidden lg:block"/>
        <span className="italic font-serif text-gray-500">Digital</span> Living.
      </h1>

      {/* ✅ NON-LCP — animated AFTER paint */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 font-light"
      >
        Elevate your everyday with premium tech essentials designed for the modern lifestyle.
      </motion.p>
    </div>
  );
};

export default HeroTitle;
