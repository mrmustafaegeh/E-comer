"use client";
import { m } from "framer-motion";
import { memo } from "react";

const AnimatedBadge = () => {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-sm"
    >
      <m.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative flex h-2 w-2"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
      </m.span>
      <span className="text-sm font-medium text-blue-300">
        Limited Time Offers • Up to 50% Off
      </span>
    </m.div>
  );
};
export default memo(AnimatedBadge);
