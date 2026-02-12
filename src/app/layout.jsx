// src/app/layout.jsx
import Header from "../Component/layout/Header.jsx";
import Footer from "../Component/layout/Footer.jsx";
import ScrollToTop from "../Component/ui/ScrollToTop.jsx";
import ClientTranslationProvider from "../Component/ClientTranslationProvider.jsx";
import ReduxProvider from "../providers/ReduxProvider.jsx";
import ReactQueryProvider from "../providers/ReactQueryProvider.jsx";
import { AuthProvider } from "../contexts/AuthContext.js";
import ChatbotTrigger from "../chatbot/ChatbotTrigger.jsx";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "./i18n.js";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata = {
  title: {
    template: "%s | QuickCart",
    default: "QuickCart - Best Electronics Store",
  },
  description:
    "Best products, unbeatable service. Your trusted partner for quality electronics.",
  keywords: "electronics, gadgets, smartphones, laptops, tech, online store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head />
      <body
        className={`${inter.variable} ${outfit.variable} flex flex-col min-h-screen w-full font-sans antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-[100]"
        >
          Skip to content
        </a>

        <ReactQueryProvider>
          <ReduxProvider>
            <AuthProvider>
              <ClientTranslationProvider>
                <Header />
                <ScrollToTop />
                <ChatbotTrigger />
                <main id="main-content" className="flex-1 w-full">
                  {children}
                </main>
                <Footer />
              </ClientTranslationProvider>
            </AuthProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
