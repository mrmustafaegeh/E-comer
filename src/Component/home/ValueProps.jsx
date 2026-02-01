"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";

const props = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On all orders over $150",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "SSL encrypted checkout",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Dedicated help center",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    desc: "30-day money back guarantee",
  },
];

export default function ValueProps() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="bg-white py-12 border-b border-gray-100 min-h-[100px]" />;

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {props.map((prop, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 group"
            >
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors duration-300">
                <prop.icon size={24} className="text-gray-900 group-hover:text-blue-600 transition-colors" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{prop.title}</h3>
                <p className="text-gray-500 text-xs">{prop.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
