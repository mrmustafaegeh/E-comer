// src/components/products/ProductGallery.jsx
"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images = [], alt = "" }) {
  // images: array of image urls. FakeStore uses single `image` string; to support thumbnails we accept array fallback.
  const primary = images && images.length ? images[0] : null;
  const [current, setCurrent] = useState(primary || images[0] || "");

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-center overflow-hidden">
        <Image
          src={current}
          alt={alt}
          className="max-h-[520px] object-contain transition-transform duration-200 hover:scale-105"
        />
      </div>

      {images && images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(img)}
              className={`flex-shrink-0 w-20 h-20 p-1 rounded border ${
                current === img ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <Image
                src={img}
                alt={`thumb-${i}`}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
