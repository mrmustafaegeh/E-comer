"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "../../Component/dashboard/Sidebar";
import AdminHeader from "../../Component/dashboard/Header";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <SessionProvider>
      {/* Full page container with gray background */}
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - Fixed on mobile, static on desktop */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 
            w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out 
            lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <AdminSidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header - Fixed at top */}
          <header className="bg-white border-b border-gray-200 flex-shrink-0">
            <AdminHeader
              onMenuClick={() => setSidebarOpen(true)}
              sidebarOpen={sidebarOpen}
            />
          </header>

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
