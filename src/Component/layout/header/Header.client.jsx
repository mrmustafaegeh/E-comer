"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useState, useEffect, useMemo } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = dynamic(() => import("../features/LanguageSwitcher"), {
  ssr: false,
  loading: () => (
    <div className="w-16 h-8 bg-gray-200 rounded-md animate-pulse" />
  ),
});

const UserProfile = dynamic(() => import("./UserProfile"), {
  ssr: false,
  loading: () => (
    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
  ),
});

const MotionNav = m.nav;
const MotionSpan = m.span;

export default function HeaderClient() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { user, loading } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = useMemo(
    () => cartItems.reduce((s, i) => s + (i.qty || 1), 0),
    [cartItems]
  );

  const nav = [
    { href: "/", label: t("common.home", "Home") },
    { href: "/products", label: t("common.products", "Products") },
    { href: "/about", label: t("common.about", "About") },
    { href: "/contact", label: t("common.contact", "Contact") },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <MotionNav
        className={`sticky top-0 z-50 transition ${
          scrolled ? "bg-white shadow-lg border-b" : "bg-white/80 backdrop-blur"
        }`}
      >
        {/* CONTENT — unchanged logic */}
        {/* Your JSX continues here */}
      </MotionNav>
    </LazyMotion>
  );
}
