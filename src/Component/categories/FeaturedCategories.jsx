"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Smartphone, Watch, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  {
    name: "Tech Essentials",
    icon: Smartphone,
    desc: "Next-gen gadgets",
    href: "/products?category=electronics",
  },
  {
    name: "Life & Style",
    icon: Watch,
    desc: "Curated collections",
    href: "/products?category=fashion",
  },
  {
    name: "Home Living",
    icon: Home,
    desc: "Modern interiors",
    href: "/products?category=home",
  },
];

export default function FeaturedCategories() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="py-24 bg-transparent min-h-[400px]" />;

  return (
    <section className="relative z-20 py-16 lg:py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 border-b border-gray-200 pb-8">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-2 block">
              Quick Access
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
              Trending Categories.
            </h2>
          </div>
          <Link 
            href="/products" 
            className="group flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors mt-4 md:mt-0"
          >
            Browse All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={c.href}
                className="group flex items-center p-8 rounded-[2rem] bg-white hover:bg-gray-900 border border-gray-100 hover:border-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
              >
                <div className="relative z-10 mr-6 p-4 rounded-2xl bg-gray-50 group-hover:bg-white/10 transition-colors">
                  <c.icon size={28} className="text-gray-900 group-hover:text-white transition-colors" />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors mb-1">
                    {c.name}
                  </h3>
                  <p className="text-gray-500 group-hover:text-gray-400 text-sm font-medium transition-colors">
                    {c.desc}
                  </p>
                </div>

                {/* Subtle arrow that appears on hover */}
                <div className="absolute right-8 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                   <ArrowRight className="text-white w-6 h-6" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
