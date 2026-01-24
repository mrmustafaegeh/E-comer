"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const NewsletterSignup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSuccess(true);
    setEmail("");
    setIsSubmitting(false);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 md:p-12 text-center mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        {t("newsletter.title")}
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        {t("newsletter.desc")}
      </p>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-green-600 font-semibold"
          >
            {t("newsletter.success")}
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {isSubmitting
                ? t("newsletter.submitting")
                : t("newsletter.subscribe")}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NewsletterSignup;
