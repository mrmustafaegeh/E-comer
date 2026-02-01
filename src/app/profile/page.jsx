"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { get, put } from "../../services/api";
import { User, Mail, MapPin, Phone, Camera, Save, Loader2, ArrowRight, ShieldCheck, LogOut, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: ""
  });

  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) {
        return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
        setLoading(true);
        const data = await get("/user/profile"); 
        const addr = data.address || {};
        
        setFormData({
            name: data.name || "",
            email: data.email || "",
            image: data.image || "",
            phone: data.phone || "",
            address: addr.street || (typeof data.address === 'string' ? data.address : "") || "",
            city: addr.city || "",
            country: addr.country || "",
            zipCode: addr.zipCode || ""
        });
    } catch (err) {
        console.error("Failed to load profile", err);
    } finally {
        setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    try {
        setUploading(true);
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", uploadPreset);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const fileData = await res.json();
        if (fileData.secure_url) {
            setFormData(prev => ({ ...prev, image: fileData.secure_url }));
        }
    } catch (err) {
        console.error("Upload failed", err);
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
        const payload = {
            name: formData.name,
            image: formData.image,
            phone: formData.phone,
            address: {
                street: formData.address,
                city: formData.city,
                country: formData.country,
                zipCode: formData.zipCode
            }
        };

        await put("/user/profile", payload);
        setMessage({ type: 'success', text: 'Protocol: Profile data synchronized successfully.' });
        if (updateUser) updateUser(payload);
    } catch (err) {
        setMessage({ type: 'error', text: 'Protocol: Synchronization failed.' });
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin w-10 h-10 text-gray-900 mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Accessing Profile Data...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Decorative Sidebar Layer */}
      <div className="fixed inset-y-0 left-0 border-r-[24px] border-gray-50 pointer-events-none z-50 hidden xl:block w-[24px]" />
      
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-20 md:py-32">
        <header className="mb-20">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Identity Console</span>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">Settings.</h1>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => logout && logout()}
                        className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                    {user?.isAdmin && (
                        <Link 
                            href="/admin/dashboard" 
                            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"
                        >
                            <ShieldCheck size={16} /> Admin Panel
                        </Link>
                    )}
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Nav Column */}
            <div className="lg:col-span-3 space-y-2">
                <button className="w-full text-left px-6 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black tracking-tight shadow-xl shadow-gray-200">Account Overview</button>
                <button className="w-full text-left px-6 py-4 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl text-sm font-bold tracking-tight transition-all">Security & Access</button>
                <button className="w-full text-left px-6 py-4 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl text-sm font-bold tracking-tight transition-all">Order History</button>
                <button className="w-full text-left px-6 py-4 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl text-sm font-bold tracking-tight transition-all">Wishlist Assets</button>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-9">
                <AnimatePresence mode="wait">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-10 p-5 rounded-[2rem] border flex items-center gap-4 text-xs font-black uppercase tracking-widest ${
                                message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                            }`}
                        >
                            <CheckCircle2 size={20} />
                            {message.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {/* Identity Segment */}
                    <div className="space-y-8">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pb-4 border-b border-gray-100">01 Identity Visualization</h3>
                        
                        <div className="flex items-center gap-10">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-[2.5rem] bg-gray-50 border border-gray-100 overflow-hidden shadow-2xl shadow-gray-100 group-hover:scale-[1.02] transition-transform">
                                    {formData.image ? (
                                        <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <User size={40} />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-gray-900 p-3 rounded-2xl text-white shadow-xl cursor-pointer hover:bg-black transition-colors border-4 border-white">
                                    <Camera size={20} strokeWidth={2.5} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-gray-900 tracking-tight mb-2">Profile Image.</h4>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">Recommended size 400x400. High contrast preferred.</p>
                                {uploading && <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2 animate-pulse">Synchronizing Asset...</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Name</label>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Authentication ID</label>
                                <input value={formData.email} disabled className="w-full bg-gray-100 border-none rounded-2xl py-4 px-6 text-gray-400 font-bold tracking-tight cursor-not-allowed" />
                            </div>
                        </div>
                    </div>

                    {/* Logistics Segment */}
                    <div className="space-y-8 pt-8">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pb-4 border-b border-gray-100">02 Logistics Routing</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile Terminal</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 000 000 000" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Street Location</label>
                                <input name="address" value={formData.address} onChange={handleChange} placeholder="Physical address" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City Hub</label>
                                <input name="city" value={formData.city} onChange={handleChange} placeholder="Hub name" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sovereign State</label>
                                <input name="country" value={formData.country} onChange={handleChange} placeholder="Country" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Locality Code</label>
                                <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="000000" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end">
                         <Link href="/" className="px-10 py-5 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all">Discard Changes</Link>
                         <button
                            type="submit"
                            disabled={saving || uploading}
                            className="flex items-center justify-center gap-3 px-12 py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black shadow-xl shadow-gray-200 transition-all disabled:opacity-50 group"
                         >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Synchronizing...
                                </>
                            ) : (
                                <>
                                    Execute Save <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                         </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}