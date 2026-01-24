"use client";

import dynamic from "next/dynamic";

const Footer = dynamic(() => import("./Footer.jsx"), {
  ssr: true,
  loading: () => <div className="h-60 w-full bg-gray-900 animate-pulse" />
});

const ScrollToTop = dynamic(() => import("../ui/ScrollToTop.jsx"), {
  ssr: false
});

export default function ClientLayout({ children }) {
  return (
    <>
      <ScrollToTop />
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
