import { m } from "framer-motion";
import { memo } from "react";

const CTAButtons = () => {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
    >
      <m.button
        whileHover={{
          scale: 1.02,
        }}
        whileTap={{ scale: 0.98 }}
        className="group relative px-10 py-4 bg-gray-900 text-white font-medium text-lg rounded-full overflow-hidden transition-all hover:bg-black"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          Explore Collection
          <m.svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </m.svg>
        </span>
      </m.button>

      <m.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-10 py-4 bg-transparent text-gray-900 font-medium text-lg rounded-full border border-gray-300 hover:border-gray-900 transition-colors"
      >
        View Lookbook
      </m.button>
    </m.div>
  );
};
export default memo(CTAButtons);
