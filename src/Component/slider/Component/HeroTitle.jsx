"use client";
import { motion } from "framer-motion";

const HeroTitle = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="space-y-4"
    >
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
        <motion.span
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="block text-white"
        >
          Discover the
        </motion.span>
        <motion.span
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Future of
        </motion.span>
        <motion.span
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="block text-white"
        >
          Shopping
        </motion.span>
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0"
      >
        Premium tech products with unbeatable deals. From cutting-edge
        electronics to lifestyle essentials.
      </motion.p>
    </motion.div>
  );
};

export default HeroTitle;
