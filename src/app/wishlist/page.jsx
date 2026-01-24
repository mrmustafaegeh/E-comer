// src/app/wishlist/page.jsx
"use client";

import Link from "next/link";
import { useWishlist } from "../../hooks/useWishlist";
import Image from "next/image";

export default function WishlistPage() {
  const wishlist = useWishlist?.() || {};
  const items = Array.isArray(wishlist.items) ? wishlist.items : [];
  const remove =
    typeof wishlist.remove === "function" ? wishlist.remove : () => {};

  if (items.length === 0) {
    return <div className="p-6">Your wishlist is empty.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Wishlist</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="border p-4 rounded">
            <Link href={`/products/${p.id}`}>
              <Image
                src={p.image || "/placeholder.png"}
                alt={p.title || "Product"}
                width={528} // ← ADD: original size
                height={528} // ← ADD: original size
                quality={85} // ← ADD: compression quality
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full h-40 object-contain mb-2"
              />
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-blue-600 font-bold">${p.price}</p>
            </Link>

            <div className="mt-2 flex gap-2">
              <button
                onClick={() => remove(p.id)}
                className="px-3 py-1 border rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
