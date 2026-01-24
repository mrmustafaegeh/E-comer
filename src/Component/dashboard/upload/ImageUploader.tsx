// src/components/dashboard/upload/page.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle } from "lucide-react";
import React from "react";
import Image from "next/image";

interface UploadResponse {
  url: string;
  pathname: string;
  size: number;
  contentType: string;
}

export default function ImageUploader() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Clear previous error
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputFileRef.current?.files?.length) {
      setError("Please select a file first");
      return;
    }

    const file = inputFileRef.current.files[0];
    setUploading(true);
    setError(null);

    try {
      // Create FormData (this is what your API expects)
      const formData = new FormData();
      formData.append("file", file);

      // Use your API endpoint (not Vercel's example endpoint)
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadedData(data);
      console.log("✅ Upload successful:", data);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
    setPreview(null);
    setUploadedData(null);
    setError(null);
  };

  const handleDelete = async () => {
    if (!uploadedData?.url) return;

    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: uploadedData.url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Delete failed");
      }

      handleClear();
      console.log("✅ Image deleted successfully");
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError("Failed to delete image");
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Image Upload</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload images to Vercel Blob storage (Max: 5MB)
          </p>
        </div>
        <Upload className="h-6 w-6 text-gray-400" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {uploadedData && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Image uploaded successfully!
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
          <input
            ref={inputFileRef}
            type="file"
            accept="image/jpeg, image/png, image/webp, image/jpg"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />

          {preview ? (
            <div className="space-y-4">
              <div className="relative mx-auto max-w-xs h-48">
                <Image
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove image
              </button>
            </div>
          ) : (
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Choose an image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            </label>
          )}
        </div>

        {/* Upload Button */}
        {preview && !uploadedData && (
          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </span>
            ) : (
              "Upload Image"
            )}
          </button>
        )}

        {/* Uploaded Info & Delete Button */}
        {uploadedData && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Uploaded Image Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">URL:</span>
                  <a
                    href={uploadedData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate max-w-[200px]"
                    title={uploadedData.url}
                  >
                    View Image
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="text-gray-800">
                    {(uploadedData.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="text-gray-800">
                    {uploadedData.contentType}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition"
              >
                Upload New
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2 px-4 bg-red-100 text-red-700 font-medium rounded-md hover:bg-red-200 transition"
              >
                Delete Image
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
