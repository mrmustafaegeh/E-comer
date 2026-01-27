"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const year = new Date().getFullYear();

  const safeT = (key, fallback) => {
    try {
      const v = t(key);
      return v === key ? fallback : v;
    } catch {
      return fallback;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const links = {
    shop: ["allProducts", "newArrivals", "featured", "discounts"],
    support: ["contactUs", "faqs", "shippingInfo", "returns"],
    company: ["about", "careers", "blog", "press"],
  };

  return (
    <footer className="mt-auto bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-14">
        {/* TOP */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* BRAND */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                QC
              </div>
              <span className="text-2xl font-bold text-white">
                {safeT("common.siteTitle", "QuickCart")}
              </span>
            </div>

            <p className="text-gray-400 max-w-md">
              {safeT(
                "footer.brandDescription",
                "Your one-stop shop for modern electronics with fast delivery and 24/7 support."
              )}
            </p>

            {/* NEWSLETTER */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5">
              <h4 className="text-white font-semibold mb-3">
                {safeT("footer.stayUpdated", "Stay Updated")}
              </h4>

              {subscribed ? (
                <div className="text-green-400 bg-green-400/10 px-4 py-3 rounded-lg">
                  {safeT(
                    "footer.thankYouSubscribing",
                    "Thank you for subscribing!"
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={safeT("footer.enterEmail", "Enter your email")}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                  >
                    {safeT("footer.subscribe", "Subscribe")}
                  </motion.button>
                </form>
              )}
            </div>
          </div>

          {/* LINKS */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-white font-semibold mb-4">
                {safeT(`footer.${group}`, group)}
              </h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition"
                    >
                      {safeT(`footer.${item}`, item.replace(/([A-Z])/g, " $1"))}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-700 my-10" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <span className="text-gray-400">
            © {year} {safeT("common.siteTitle", "QuickCart")}.{" "}
            {safeT("footer.allRightsReserved", "All rights reserved.")}
          </span>

          <div className="flex gap-5">
            {["termsOfService", "privacyPolicy", "cookiePolicy"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-gray-400 hover:text-white transition"
              >
                {safeT(`footer.${item}`, item.replace(/([A-Z])/g, " $1"))}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {safeT("footer.allSystemsOperational", "All systems operational")}
          </div>
        </div>
      </div>
    </footer>
  );
}
