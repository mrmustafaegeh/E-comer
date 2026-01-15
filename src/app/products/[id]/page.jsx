"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../hooks/useCart";
import { useWishlist } from "../../../hooks/useWishlist";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";
import LoadingSpinner from "../../../Component/ui/LoadingSpinner";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const safeWishlist = wishlistItems ?? [];
  const isWishlisted =
    product && safeWishlist.some((item) => item._id === product._id);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h2>
        <button
          onClick={() => router.push("/products")}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  // Mock additional images (replace with actual product images array)
  const images = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 aspect-square">
              <Image
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
                width={528} // ← ADD: original size
                height={528} // ← ADD: original size
                quality={85} // ← ADD: compression quality
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative bg-white rounded-lg overflow-hidden border-2 aspect-square transition ${
                    selectedImage === index
                      ? "border-indigo-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${index + 1}`}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 25vw, 15vw"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
                {product.category}
              </span>
              {product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} ({product.numReviews || 0}{" "}
                    reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-gray-900">
                ${(product.offerPrice || product.price).toFixed(2)}
              </span>
              {product.offerPrice && (
                <span className="text-2xl text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-b border-gray-200 py-6">
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock > 10
                    ? "bg-green-500"
                    : product.stock > 0
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  product.stock > 10
                    ? "text-green-600"
                    : product.stock > 0
                    ? "text-orange-600"
                    : "text-red-600"
                }`}
              >
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-2 font-medium border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                  className="p-3 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-xl border-2 transition ${
                  isWishlisted
                    ? "bg-red-50 border-red-500 text-red-500"
                    : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Truck className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Free Shipping
                </span>
                <span className="text-xs text-gray-500">
                  On orders over $50
                </span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Shield className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Secure Payment
                </span>
                <span className="text-xs text-gray-500">100% protected</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
                <Star className="w-8 h-8 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Top Quality
                </span>
                <span className="text-xs text-gray-500">Premium products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
