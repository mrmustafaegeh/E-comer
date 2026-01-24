"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function UserProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
          {user.image ? (
            <img 
                src={user.image} 
                alt={user.name} 
                className="w-full h-full object-cover" 
            />
          ) : (
            user.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>
        <span className="text-sm font-medium">{user.name}</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/orders");
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Orders
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/admin/dashboard");
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}