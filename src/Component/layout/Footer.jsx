"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentYear, setCurrentYear] = useState(2025); // Default fallback

  // Handle date on client side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Fixed safe translation function
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
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mt-auto bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="flex items-center mb-4"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">QC</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {safeTranslate("common.siteTitle", "QuickCart")}
              </span>
            </motion.div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 mb-6 leading-relaxed max-w-md"
            >
              {safeTranslate(
                "footer.brandDescription",
                "Your one-stop shop for quality electronics and exceptional service. We bring the latest technology to your doorstep with fast delivery and 24/7 support."
              )}
            </motion.p>

            {/* Newsletter Subscription */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50"
            >
              <h4 className="text-white font-semibold mb-3">
                {safeTranslate("footer.stayUpdated", "Stay Updated")}
              </h4>
              {isSubscribed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center text-green-400 bg-green-400/10 px-4 py-3 rounded-lg"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {safeTranslate(
                    "footer.thankYouSubscribing",
                    "Thank you for subscribing!"
                  )}
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={safeTranslate(
                      "footer.enterEmail",
                      "Enter your email"
                    )}
                    className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                  >
                    {safeTranslate("footer.subscribe", "Subscribe")}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Quick Links */}
          {[
            { key: "shop", title: safeTranslate("footer.shop", "Shop") },
            {
              key: "support",
              title: safeTranslate("footer.support", "Support"),
            },
            {
              key: "company",
              title: safeTranslate("footer.company", "Company"),
            },
          ].map((section, sectionIndex) => (
            <motion.div
              key={section.key}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 + sectionIndex * 0.1 }}
            >
              <h3 className="text-white text-lg font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.key === "shop" &&
                  [
                    "allProducts",
                    "newArrivals",
                    "featured",
                    "discounts",
                    "bestSellers",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/products?filter=${item
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 block"
                      >
                        {safeTranslate(
                          `footer.${item}`,
                          item.replace(/([A-Z])/g, " $1").trim()
                        )}
                      </Link>
                    </li>
                  ))}
                {section.key === "support" &&
                  [
                    "contactUs",
                    "faqs",
                    "shippingInfo",
                    "returns",
                    "warranty",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/support/${item
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 block"
                      >
                        {safeTranslate(
                          `footer.${item}`,
                          item.replace(/([A-Z])/g, " $1").trim()
                        )}
                      </Link>
                    </li>
                  ))}
                {section.key === "company" &&
                  ["about", "careers", "blog", "press", "sustainability"].map(
                    (item) => (
                      <li key={item}>
                        <Link
                          href={`/company/${item
                            .toLowerCase()
                            .replace(" ", "-")}`}
                          className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1 block"
                        >
                          {safeTranslate(
                            `footer.${item}`,
                            item.replace(/([A-Z])/g, " $1").trim()
                          )}
                        </Link>
                      </li>
                    )
                  )}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Social Media & Contact */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border-t border-gray-700 pt-8 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Media */}
            <div className="flex space-x-4">
              {[
                {
                  name: "Facebook",
                  icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                },
                {
                  name: "Twitter",
                  icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                },
                {
                  name: "Instagram",
                  icon: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c-.247.636-.416 1.363-.465 2.427-.048 1.067-.06 1.407-.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
                },
                {
                  name: "LinkedIn",
                  icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 group border border-gray-600/50"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-right">
              <div className="text-white font-semibold mb-2">
                {safeTranslate("footer.contactInfo", "Contact Info")}
              </div>
              <div className="text-gray-400 text-sm space-y-1">
                <div>support@quickcart.com</div>
                <div>+1 (555) 123-4567</div>
                <div>
                  {safeTranslate(
                    "footer.customerSupport",
                    "24/7 Customer Support"
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-700 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} {safeTranslate("common.siteTitle", "QuickCart")}.{" "}
              {safeTranslate(
                "footer.allRightsReserved",
                "All rights reserved."
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              {[
                "termsOfService",
                "privacyPolicy",
                "cookiePolicy",
                "accessibility",
              ].map((item) => (
                <motion.div key={item} whileHover={{ scale: 1.05 }}>
                  <Link
                    href={`/legal/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {safeTranslate(
                      `footer.${item}`,
                      item.replace(/([A-Z])/g, " $1").trim()
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
              <span>
                {safeTranslate(
                  "footer.allSystemsOperational",
                  "All systems operational"
                )}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
