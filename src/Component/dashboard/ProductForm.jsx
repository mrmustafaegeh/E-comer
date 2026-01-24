// src/components/admin/ProductForm.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Upload,
  ImageIcon,
  AlertCircle,
  Loader2,
  DollarSign,
  Package,
  Tag,
  Hash,
  FileText,
  Star,
  CheckCircle,
  Trash2,
} from "lucide-react";

// Validation Schema
const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  price: z.number().min(0, "Price must be positive"),
  offerPrice: z.number().min(0).optional().or(z.literal(0)),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Please upload a valid image"),
  stock: z.number().min(0, "Stock must be positive"),
  featured: z.boolean().default(false),
  tags: z.string().optional(),
  sku: z.string().optional(),
});

export default function ProductForm({ initialValues = {}, onSaved }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(initialValues.image || "");
  const [oldImageUrl, setOldImageUrl] = useState(initialValues.image || "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(schema),
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
    mode: "onChange",
  });

  const imageUrl = watch("image");
  const price = watch("price");
  const offerPrice = watch("offerPrice");
  const featured = watch("featured");
  const description = watch("description");

  // Calculate discount percentage
  const discountPercentage =
    offerPrice && price > 0
      ? Math.round(((price - offerPrice) / price) * 100)
      : 0;

  // Update preview when image URL changes
  useEffect(() => {
    if (imageUrl && imageUrl !== previewUrl) {
      setPreviewUrl(imageUrl);
    }
  }, [imageUrl, previewUrl]);

  // Initialize form with values if editing - FIXED: Only run once when initialValues.id changes
  useEffect(() => {
    if (initialValues.id) {
      reset(initialValues);
      setOldImageUrl(initialValues.image || "");
    }
  }, [initialValues.id]); // Only depend on ID, not the entire initialValues object

  // Generate SKU function
  const generateSKU = useCallback(() => {
    const sku = `PROD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;
    setValue("sku", sku, { shouldValidate: true });
  }, [setValue]);

  /**
   * Handle file selection and upload to Vercel Blob
   */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload JPEG, PNG, or WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      // Create preview immediately with cleanup
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Vercel Blob
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (data?.url) {
        // If updating existing product with old image, delete old one
        if (
          oldImageUrl &&
          oldImageUrl !== data.url &&
          oldImageUrl.includes("blob.vercel-storage.com")
        ) {
          try {
            await fetch("/api/upload", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ url: oldImageUrl }),
            });
          } catch (err) {
            console.error("Failed to delete old image:", err);
          }
        }

        setValue("image", data.url, { shouldValidate: true });
        setPreviewUrl(data.url);
        setOldImageUrl(data.url);
        setUploadError("");
      }
    } catch (err) {
      console.error("Upload failed", err);
      setUploadError(err.message || "Upload failed. Please try again.");
      setPreviewUrl("");
    } finally {
      setUploading(false);
    }
  };

  /**
   * Remove current image
   */
  const handleRemoveImage = async () => {
    if (previewUrl && previewUrl.includes("blob.vercel-storage.com")) {
      try {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: previewUrl }),
        });
      } catch (err) {
        console.error("Failed to delete image:", err);
      }
    }

    setValue("image", "", { shouldValidate: true });
    setPreviewUrl("");
    setOldImageUrl("");
    setUploadError("");

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  /**
   * Form submission
   */
  const onSubmit = async (data) => {
    if (onSaved) {
      try {
        await onSaved(data);
      } catch (error) {
        console.error("Save failed:", error);
        setUploadError("Failed to save product. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-white rounded-xl shadow border border-gray-200 p-6 lg:p-8"
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {initialValues.id ? "Edit Product" : "Create New Product"}
        </h1>
        <p className="text-gray-600 mt-2">
          {initialValues.id
            ? "Update product information and images"
            : "Add a new product to your store"}
        </p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Title */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Product Title *
          </label>
          <div className="relative">
            <input
              {...register("title")}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="e.g., Wireless Bluetooth Headphones"
            />
            <Package className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          {errors.title && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Price Fields */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Regular Price ($) *
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="99.99"
            />
            <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          {errors.price && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Sale Price ($)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              {...register("offerPrice", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="79.99"
            />
            <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          {offerPrice > 0 && price > 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {discountPercentage}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Category & Stock */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Category *
          </label>
          <select
            {...register("category")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
          >
            <option value="">Select a category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Garden</option>
            <option value="books">Books</option>
            <option value="sports">Sports & Outdoors</option>
          </select>
          {errors.category && (
            <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Stock Quantity *
          </label>
          <div className="relative">
            <input
              type="number"
              {...register("stock", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="100"
            />
            <Hash className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
          {errors.stock && (
            <p className="text-sm text-red-500 mt-2">{errors.stock.message}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Description *
        </label>
        <div className="relative">
          <textarea
            {...register("description")}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            placeholder="Describe your product in detail..."
          />
          <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        </div>
        <div className="flex justify-between items-center mt-2">
          {errors.description && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.description.message}
            </p>
          )}
          <span className="text-xs text-gray-500">
            {description?.length || 0}/1000 characters
          </span>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="border-t border-gray-200 pt-8">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          Product Image *
        </label>

        {/* Image Preview & Upload Area */}
        <div className="space-y-4">
          {/* Preview or Upload Placeholder */}
          {previewUrl ? (
            <div className="relative w-full max-w-md group">
              <div className="relative w-full h-64 border-2 border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <Image
                  width={528} // ← ADD: original size
                  height={528} // ← ADD: original size
                  quality={85} // ← ADD: compression quality
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={previewUrl}
                  alt="Product preview"
                  className="w-full h-full object-contain"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Uploaded Success Badge */}
              {imageUrl && imageUrl.includes("blob.vercel-storage.com") && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Uploaded to Vercel Blob Storage</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50">
              <ImageIcon size={48} className="text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Upload product image
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
            </div>
          )}

          {/* Upload Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Upload Button */}
            <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
              <Upload size={18} />
              <span>
                {uploading
                  ? "Uploading..."
                  : previewUrl
                  ? "Change Image"
                  : "Choose Image"}
              </span>
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                disabled={uploading}
              />
            </label>

            {/* Remove Image Button */}
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Trash2 size={18} />
                Remove Image
              </button>
            )}

            {/* Upload Status */}
            {uploading && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 size={18} className="animate-spin" />
                Uploading to Vercel Blob...
              </div>
            )}
          </div>

          {/* Upload Error */}
          {uploadError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={16} />
                {uploadError}
              </p>
            </div>
          )}

          {/* Image Validation Error */}
          {errors.image && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.image.message}
              </p>
            </div>
          )}

          {/* Image Requirements Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Supports JPEG, PNG, WebP formats</p>
            <p>• Maximum file size: 5MB</p>
            <p>• Images are stored securely on Vercel Blob Storage</p>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="border-t border-gray-200 pt-8">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-blue-600 mb-4"
        >
          <span>{showAdvanced ? "Hide" : "Show"} Advanced Options</span>
          <svg
            className={`w-4 h-4 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU (Stock Keeping Unit)
              </label>
              <div className="flex gap-2">
                <input
                  {...register("sku")}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter SKU"
                />
                <button
                  type="button"
                  onClick={generateSKU}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                {...register("tags")}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            {/* Featured Product */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <div
                className={`p-1.5 rounded ${
                  featured ? "bg-yellow-100" : "bg-gray-100"
                }`}
              >
                <Star
                  size={16}
                  className={featured ? "text-yellow-500" : "text-gray-400"}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Featured Product
                </label>
                <p className="text-xs text-gray-500">
                  Show this product in featured sections
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("featured")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-8 border-t border-gray-200">
        <button
          disabled={isSubmitting || uploading || !isValid}
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>{initialValues.id ? "Update Product" : "Create Product"}</>
          )}
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
