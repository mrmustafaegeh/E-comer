import { m } from "framer-motion";
import { memo } from "react";

const ProductIndicators = ({ products, activeProduct, setActiveProduct }) => {
  return (
    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
      {products.map((_, idx) => (
        <m.button
          key={idx}
          onClick={() => setActiveProduct(idx)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to slide ${idx + 1}`}
          className={`w-2 h-2 rounded-full transition-all ${
            idx === activeProduct ? "bg-white w-8" : "bg-white/30"
          }`}
        />
      ))}
    </div>
  );
};

export default memo(ProductIndicators);
