"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  motion,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { useAuth } from "../../contexts/AuthContext";

const LanguageSwitcher = dynamic(() => import("../features/LanguageSwitcher"), { 
  ssr: false,
  loading: () => <div className="w-16 h-8 bg-gray-100 animate-pulse rounded-md" />
});

const UserProfile = dynamic(() => import("./UserProfile"), { 
  ssr: false,
  loading: () => <div className="w-10 h-10 bg-gray-100 animate-pulse rounded-full" />
});

// Motion shorthands
const MotionNav = m.nav;
const MotionDiv = m.div;
const MotionButton = m.button;
const MotionSpan = m.span;

// === AUTH BUTTON COMPONENT ===
const LoginButton = () => (
  <Link
    href="/auth/login"
    className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition font-semibold text-sm"
  >
    Login
  </Link>
);

// === HEADER COMPONENT ===
export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { cartItems } = useCart();
  const { user, loading } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  /** Safe Translation */
  const safeT = (key, fallback) => {
    try {
      const translated = t(key);
      return translated === key ? fallback : translated;
    } catch {
      return fallback;
    }
  };

  /** Scroll Listener */
  const handleScroll = useCallback(
    () => setIsScrolled(window.scrollY > 10),
    []
  );
  useEffect(() => {
    if (!mounted) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, handleScroll]);

  /** Cart Count */
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.qty || 1), 0),
    [cartItems]
  );

  /** Navigation */
  const navItems = [
    { href: "/", label: safeT("common.home", "Home") },
    { href: "/products", label: safeT("common.products", "Products") },
    { href: "/about", label: safeT("common.about", "About Us") },
    { href: "/contact", label: safeT("common.contact", "Contact") },
  ];

  const isActive = (path) =>
    pathname === path
      ? "bg-blue-600 text-white shadow-lg"
      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition";

  /** Mobile toggle overflow */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isMobileMenuOpen]);

  if (!mounted)
    return (
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md h-16 md:h-20 shadow-sm"></nav>
    );

  return (
    <LazyMotion features={domAnimation}>
      <MotionNav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className={`sticky top-0 z-50 transition-all ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
            : "bg-white/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* LOGO */}
            <MotionDiv whileHover={{ scale: 1.02 }}>
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-xl tracking-tighter">Q</span>
                </div>
                <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                  {safeT("common.siteTitle", "QuickCart")}
                </span>
              </Link>
            </MotionDiv>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex flex-1 justify-between items-center">
              <ul className="flex ml-10 space-x-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`px-3 py-2 text-sm font-medium transition-colors ${
                        isActive(item.href) ? "text-black" : "text-gray-500 hover:text-black"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                {/* Show UserProfile if logged in, otherwise Login button */}
                {loading ? (
                  <div className="w-20 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                ) : user ? (
                  <UserProfile user={user} />
                ) : (
                  <LoginButton />
                )}

                {/* CART */}
                <Link
                  href="/cart"
                  className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Cart"
                >
                  <svg
                    className="w-6 h-6 text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <MotionSpan
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-black text-white rounded-full text-[10px] h-5 w-5 flex items-center justify-center font-bold"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </MotionSpan>
                  )}
                </Link>
              </div>
            </div>

            {/* MOBILE NAV */}
            <div className="md:hidden flex items-center space-x-3">
              <LanguageSwitcher />

              <Link
                href="/cart"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs h-5 w-5 flex items-center justify-center">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              <MotionButton
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                onClick={() => setIsMobileMenuOpen((p) => !p)}
              >
                {isMobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </MotionButton>
            </div>
          </div>

          {/* MOBILE MENU CONTENT */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-2 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-200 overflow-hidden"
              >
                <div className="p-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${isActive(
                        item.href
                      )}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Show user profile or login button based on login status */}
                  <div className="pt-2 border-t border-gray-200">
                    {loading ? (
                      <div className="w-full h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                    ) : user ? (
                      <UserProfile user={user} />
                    ) : (
                      <LoginButton />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionNav>
    </LazyMotion>
  );
}
