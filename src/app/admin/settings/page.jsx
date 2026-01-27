// app/admin/settings/page.jsx
"use client";

export default function AdminSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
        <p className="text-gray-600">
          This is where site-wide settings will be managed.
        </p>
      </div>
    </div>
  );
}
