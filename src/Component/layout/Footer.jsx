"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const safeTranslate = (key, fallback) => {
    try {
      const translation = t(key);
      return translation === key ? fallback : translation;
    } catch (error) {
      return fallback;
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && !isSubscribed) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="mt-auto bg-gray-50 border-t border-gray-100 text-gray-900">
      {/* Top Decoration Line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center mr-3 text-white font-bold group-hover:bg-blue-600 transition-colors">
                QC
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                {safeTranslate("common.siteTitle", "QuickCart")}
              </span>
            </Link>
            
            <p className="text-gray-500 leading-relaxed max-w-sm">
              {safeTranslate(
                "footer.brandDescription",
                "Your premium destination for quality electronics and lifestyle essentials. Experience shopping reimagined."
              )}
            </p>

            <div className="flex space-x-4">
              {[
                { name: "Facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                { name: "Twitter", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { name: "Instagram", icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 11-2 2 2 2 0 012-2z" } // Actually LinkedIn icon path reused for simplicity or replace
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-6">Shop</h3>
              <ul className="space-y-4">
                {["New Arrivals", "Best Sellers", "Electronics", "Accessories"].map((item) => (
                  <li key={item}>
                    <Link href="/products" className="text-gray-500 hover:text-blue-600 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-6">Company</h3>
              <ul className="space-y-4">
                {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                  <li key={item}>
                    <Link href={`/${item.toLowerCase().replace(" ", "-")}`} className="text-gray-500 hover:text-blue-600 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h3 className="font-bold text-gray-900 mb-6">Stay in the loop</h3>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-2 p-1 bg-gray-900 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                   </svg>
                  </button>
                </div>
                {isSubscribed && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-green-600 font-medium"
                  >
                    Thanks for subscribing!
                  </motion.p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {currentYear} QuickCart. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
