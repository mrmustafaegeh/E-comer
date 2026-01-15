"use client";

import { useState } from "react";
import { post } from "../../services/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await post("/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-[60vh] flex flex-col justify-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have questions? Reach us anytime and we’ll get back to you as soon as
        possible.
      </p>

      {status === "success" ? (
        <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl text-center">
          <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
          <p>Thank you for contacting us. We will reply to your email shortly.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-green-600 hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Your email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Message</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="How can we help you?"
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
            />
          </div>

          {status === "error" && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
              Something went wrong. Please try again.
            </div>
          )}

          <button
            disabled={status === "loading"}
            className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
