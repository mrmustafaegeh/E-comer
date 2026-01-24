// src/app/layout.jsx
import Header from "../Component/layout/Header.jsx";
import Footer from "../Component/layout/Footer.jsx";
import ScrollToTop from "../Component/ui/ScrollToTop.jsx";
import ClientTranslationProvider from "../Component/ClientTranslationProvider.jsx";
import ReduxProvider from "../providers/ReduxProvider.jsx";
import ReactQueryProvider from "../providers/ReactQueryProvider.jsx"; // ✅ Add this
import { AuthProvider } from "../contexts/AuthContext.js";
import DeferredCSS from "../Component/ui/eferredCSS.jsx";
import "./globals.css";
import "./i18n.js";

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
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen w-full">
        <DeferredCSS />
        <ReactQueryProvider>
          <ReduxProvider>
            <AuthProvider>
              <ClientTranslationProvider>
                <Header />
                <ScrollToTop />
                <div className="flex-1 w-full">{children}</div>
                <Footer />
              </ClientTranslationProvider>
            </AuthProvider>
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
