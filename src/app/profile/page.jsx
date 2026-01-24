"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { get, put } from "../../services/api";
import { User, Mail, MapPin, Phone, Camera, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if (!cloudName || !uploadPreset) {
        alert("Cloudinary configuration missing in .env.local");
        return;
    }

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
        } else {
            console.error("Upload error details:", JSON.stringify(fileData, null, 2));
            alert(`Upload failed: ${fileData.error?.message || "Unknown error"}`);
        }

    } catch (err) {
        console.error("Upload failed", err);
        alert("Error uploading image");
    } finally {
        setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
        const addressObj = {
            street: formData.address,
            city: formData.city,
            country: formData.country,
            zipCode: formData.zipCode
        };

        const payload = {
            name: formData.name,
            image: formData.image,
            phone: formData.phone,
            address: addressObj
        };

        await put("/user/profile", payload);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Update the auth context with the new data including the image
        if (updateUser) {
            updateUser({
                name: payload.name,
                image: payload.image,
                phone: payload.phone,
                address: payload.address
            });
        }

    } catch (err) {
        console.error("Save error", err);
        setMessage({ type: 'error', text: 'Failed to save changes.' });
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Header / Cover */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>

            <div className="px-8 pb-8">
                {/* Profile Image & Basic Info */}
                <div className="relative flex items-end -mt-12 mb-6">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                            {formData.image ? (
                                <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <User size={40} />
                                </div>
                            )}
                        </div>
                        
                        {/* Camera Icon Overlay */}
                        <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                            <Camera size={16} className="text-gray-600" />
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                    
                    <div className="ml-4 mb-1">
                        <h2 className="text-2xl font-bold text-gray-900">{formData.name || "User"}</h2>
                        <p className="text-gray-500 text-sm">{formData.email}</p>
                    </div>
                </div>

                {uploading && <p className="text-sm text-blue-600 mb-4 animate-pulse">Uploading image...</p>}
                
                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

                        {/* Email (Read Only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin size={20} className="text-gray-400" />
                            Shipping Address
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="123 Main St"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="New York"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="USA"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="10001"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                         <Link href="/" className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                            Cancel
                         </Link>
                         <button
                            type="submit"
                            disabled={saving || uploading}
                            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                         >
                            {saving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
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