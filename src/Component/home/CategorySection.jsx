"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Smartphone, Watch, Headphones, Camera, Laptop, Gamepad } from "lucide-react";
import { useState, useEffect } from "react";

const categories = [
  {
    id: "electronics",
    name: "Tech & Gadgets",
    description: "Future-forward essentials",
    icon: Smartphone,
    href: "/products?category=electronics",
    image: "/images/categories/electronics.png",
    gridSpan: "md:col-span-2",
  },
  {
    id: "fashion",
    name: "Life & Style",
    description: "Curated wardrobe",
    icon: Watch,
    href: "/products?category=fashion",
    image: "/images/categories/fashion.png",
    gridSpan: "md:col-span-1",
  },
  {
    id: "computing",
    name: "Pro Computing",
    description: "Built for performance",
    icon: Laptop,
    href: "/products?category=computing",
    image: "/images/categories/computing.png",
    gridSpan: "md:col-span-3",
  },
];

const CategorySection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering motion content after mount
  if (!mounted) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
           <div className="h-[600px] w-full bg-gray-50 animate-pulse rounded-[2rem]" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4 block"
          >
            Collections
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight"
          >
            Shop the Edit.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={category.gridSpan}
            >
              <Link
                href={category.href}
                className="group relative flex flex-col justify-end p-8 md:p-12 h-[450px] md:h-[600px] rounded-[2.5rem] bg-gray-100 overflow-hidden transition-all duration-700 hover:shadow-2xl"
              >
                {/* Background Image */}
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Content */}
                <div className="relative z-10 text-white">
                  <category.icon size={32} className="mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 font-medium mb-8 max-w-xs">
                    {category.description}
                  </p>
                  
                  <div className="inline-flex items-center text-sm font-bold bg-white text-black px-6 py-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    Explore <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
