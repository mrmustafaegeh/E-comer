// src/app/admin/layout.jsx
"use client";

import { useState, useEffect, memo } from "react";
import AdminSidebar from "../../Component/dashboard/Sidebar";
import AdminHeader from "../../Component/dashboard/Header";
import { usePathname } from "next/navigation";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // ✅ Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // ✅ Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out 
          lg:translate-x-0 lg:transition-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Sidebar navigation"
      >
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex-shrink-0 sticky top-0 z-30">
          <AdminHeader
            onMenuClick={() => setSidebarOpen(true)}
            sidebarOpen={sidebarOpen}
          />
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6" id="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default memo(AdminLayout);