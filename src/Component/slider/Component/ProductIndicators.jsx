"use client";
import { motion } from "framer-motion";
const ProductIndicators = ({ products, activeProduct, setActiveProduct }) => {
  return (
    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
      {products.map((_, idx) => (
        <motion.button
          key={idx}
          onClick={() => setActiveProduct(idx)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className={`w-2 h-2 rounded-full transition-all ${
            idx === activeProduct ? "bg-white w-8" : "bg-white/30"
          }`}
        />
      ))}
    </div>
  );
};

export default ProductIndicators;
