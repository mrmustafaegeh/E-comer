
import Image from "next/image";

export default function FeaturedProducts({ products = [] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
        <svg
          className="w-20 h-20 text-yellow-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        <p className="text-gray-700 font-semibold text-lg mb-2">
          No products available
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Add some products to get started
        </p>
        <code className="inline-block bg-gray-900 text-green-400 px-4 py-2 rounded-lg text-sm font-mono">
          node seed.js
        </code>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div
          key={product._id}
          className="group bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Product Image */}
          <div className="relative overflow-hidden bg-gray-50 aspect-square">
            <Image
              width={528} // ← ADD: original size
              height={528} // ← ADD: original size
              quality={85} // ← ADD: compression quality
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={product.image || "/images/default-product.png"}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              {product.offerPrice && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  SAVE{" "}
                  {Math.round(
                    ((product.price - product.offerPrice) / product.price) * 100
                  )}
                  %
                </span>
              )}
              {product.rating >= 4.5 && (
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg ml-auto">
                  ⭐ Top Rated
                </span>
              )}
            </div>

            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
              <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition transform translate-y-4 group-hover:translate-y-0">
                Quick View
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-5">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition min-h-[3rem]">
              {product.title}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-gray-900">
                ${(product.offerPrice || product.price).toFixed(2)}
              </span>
              {product.offerPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating & Reviews */}
            {product.rating > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
                {product.numReviews > 0 && (
                  <span className="text-xs text-gray-500">
                    ({product.numReviews} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Stock indicator */}
            {product.stock !== undefined && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs">
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
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
