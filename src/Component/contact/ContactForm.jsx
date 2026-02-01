"use client";

import { useState } from "react";
import { post } from "../../services/api";
import { Send, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

export default function ContactForm() {
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

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-8 border border-green-100">
            <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Transmission Received.</h3>
        <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-10">We will respond within 24 cycles</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-gray-900 border-b-2 border-gray-900 pb-1 font-black text-sm uppercase tracking-widest hover:text-blue-600 hover:border-blue-600 transition-all"
        >
          Send New Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Identity</label>
          <input
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:ring-4 focus:ring-gray-200 font-bold tracking-tight"
            placeholder="Name or Organization"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Point of Return</label>
          <input
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:ring-4 focus:ring-gray-200 font-bold tracking-tight"
            placeholder="Official Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Payload (Message)</label>
          <textarea
            className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:ring-4 focus:ring-gray-200 font-bold tracking-tight resize-none"
            placeholder="Data to be transmitted..."
            rows={4}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
          />
        </div>
      </div>

      {status === "error" && (
        <div className="text-red-600 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center">
          Transmission Interrupted. Please retry.
        </div>
      )}

      <button
        disabled={status === "loading"}
        className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 group mt-4 px-8"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-black uppercase tracking-widest">Transmitting...</span>
          </>
        ) : (
          <>
            <span className="text-sm font-black uppercase tracking-widest">Execute Transmission</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}
