"use client";

import React, { useEffect, useCallback, useState } from "react";
import NextImage from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Trash2, ArrowRight, Loader2, Plus, Info, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Types & Schema                                                      */
/* ------------------------------------------------------------------ */

export interface ProductFormValues {
  id?: string;
  title: string;
  price: number;
  offerPrice?: number;
  description: string;
  category: string;
  image: string;
  stock: number;
  featured: boolean;
  tags?: string;
  sku?: string;
}

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.number().min(0, "Price must be positive"),
  offerPrice: z.number().min(0).optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Valid image URL required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  featured: z.boolean(),
  tags: z.string().optional(),
  sku: z.string().optional(),
});

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  onSaved?: (data: ProductFormValues) => Promise<void>;
}

/* ------------------------------------------------------------------ */
/* Safe Image Preview Component                                        */
/* ------------------------------------------------------------------ */

function ProductPreviewImage({ src }: { src: string }) {
  if (!src || typeof src !== "string") return null;

  return (
    <NextImage
      src={src}
      alt="Product preview"
      fill
      className="object-contain"
      priority
    />
  );
}

/* ------------------------------------------------------------------ */
/* Main Component                                                      */
/* ------------------------------------------------------------------ */

export default function ProductForm({
  initialValues = {},
  onSaved,
}: ProductFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      title: "",
      price: 0,
      offerPrice: 0,
      description: "",
      category: "",
      image: "",
      stock: 0,
      featured: false,
      tags: "",
      sku: `SKU-${Date.now()}`,
    },
  });

  const price = watch("price");
  const offerPrice = watch("offerPrice");
  const featured = watch("featured");
  const description = watch("description");

  useEffect(() => {
    if (!initialValues?.id) return;
    reset(initialValues as ProductFormValues);
    if (typeof initialValues.image === "string") {
      setPreviewUrl(initialValues.image);
      setValue("image", initialValues.image);
    }
  }, [initialValues?.id, reset, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Invalid image type");
      return;
    }

    setUploading(true);
    setUploadError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      setValue("image", data.url, { shouldValidate: true });
      setPreviewUrl(data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = useCallback(() => {
    setPreviewUrl("");
    setValue("image", "", { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data: ProductFormValues) => {
    if (!onSaved) return;
    await onSaved(data);
  };

  const discount =
    offerPrice && price > 0
      ? Math.round(((price - offerPrice) / price) * 100)
      : 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-5xl mx-auto space-y-16 pb-24"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Asset Registration</span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                {initialValues.id ? "Edit File." : "New Asset."}
            </h1>
        </div>
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={() => reset()}
                className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
                Reset Form
            </button>
            <button
                disabled={!isValid || uploading || isSubmitting}
                type="submit"
                className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center gap-3 group disabled:opacity-50"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" size={16} />
                        Processing...
                    </>
                ) : (
                    <>
                        {initialValues.id ? "Update Archive" : "Execute Entry"}
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Essential Info */}
            <section className="space-y-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pb-4 border-b border-gray-100">01 Primary Specifications</h3>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Asset Nomenclature (Title)</label>
                    <input
                        {...register("title")}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                        placeholder="Premium Edition Product Name..."
                    />
                    {errors.title && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 mt-1">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Asset Valuation (Price)</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xs">$</span>
                            <input
                                type="number"
                                {...register("price", { valueAsNumber: true })}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-gray-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Adjustment (Sale Price)</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xs">$</span>
                            <input
                                type="number"
                                {...register("offerPrice", { valueAsNumber: true })}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-gray-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                            />
                            {discount > 0 && (
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-green-600 uppercase tracking-widest">-{discount}% Delta</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Data Log (Description)</label>
                    <textarea
                        {...register("description")}
                        rows={6}
                        className="w-full bg-gray-50 border-none rounded-3xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight resize-none"
                        placeholder="Comprehensive asset description and specifications..."
                    />
                    <div className="flex justify-between items-center px-1">
                        {errors.description ? (
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">{errors.description.message}</p>
                        ) : <div />}
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{description?.length ?? 0} CHARS</span>
                    </div>
                </div>
            </section>

            {/* Logistics & Category */}
            <section className="space-y-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pb-4 border-b border-gray-100">02 Logistic Parameters</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Taxonomy (Category)</label>
                        <input
                            {...register("category")}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                            placeholder="Electronics, Luxury, etc."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest ml-1">Availability (Stock)</label>
                        <input
                            type="number"
                            {...register("stock", { valueAsNumber: true })}
                            className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-8 pt-4">
                     <label className="group flex items-center gap-4 cursor-pointer">
                        <div className="relative w-6 h-6">
                            <input type="checkbox" {...register("featured")} className="peer absolute inset-0 opacity-0 cursor-pointer" />
                            <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-gray-100 peer-checked:bg-gray-900 peer-checked:border-gray-900 transition-all" />
                            <Plus className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all" size={12} strokeWidth={4} />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Highlight in Showcase (Featured)</span>
                    </label>
                </div>
            </section>
        </div>

        {/* Sidebar: Visuals */}
        <div className="lg:col-span-4 space-y-12">
            <section className="space-y-8">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pb-4 border-b border-gray-100">03 Visual Asset</h3>
                
                <div className="relative">
                    {previewUrl ? (
                        <div className="group relative w-full aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-100 transition-all">
                            <ProductPreviewImage src={previewUrl} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="p-5 bg-white text-red-600 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <label className="w-full aspect-[4/5] bg-gray-50 border-4 border-dashed border-gray-100 rounded-[3.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-gray-200 transition-all group">
                            <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-gray-200 mb-6 group-hover:scale-110 transition-transform">
                                <ImageIcon size={32} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center group-hover:text-gray-900 transition-all">
                                Upload Asset Data<br />
                                <span className="opacity-50">(4:5 Ratio Recommended)</span>
                            </span>
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    )}
                    
                    {uploading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-[3.5rem] flex flex-col items-center justify-center z-10">
                            <Loader2 className="animate-spin text-gray-900 mb-4" size={32} />
                            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Transmitting Imagery...</span>
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {uploadError && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100">
                           {uploadError}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 mt-8">
                    <div className="flex items-start gap-4">
                        <ShieldCheck className="text-blue-600 flex-shrink-0" size={20} />
                        <p className="text-[10px] font-bold text-blue-900 uppercase tracking-widest leading-relaxed">
                            Asset will be cross-referenced with global database upon execution. Ensure visual clarity.
                        </p>
                    </div>
                </div>
            </section>
        </div>
      </div>
    </form>
  );
}
