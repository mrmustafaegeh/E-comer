"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../contexts/AuthContext";
import { post } from "../../services/api";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CreditCard, MapPin, Truck } from "lucide-react";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    paymentMethod: "cod",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  // Pre-fill name if user exists
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const subtotal = Number(cartTotal) || 0;
    const shipping = 0; // Free shipping
    return subtotal + shipping;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in to place an order.");
      setLoading(false);
      return;
    }

    try {
      // Stripe Payment Flow
      if (formData.paymentMethod === "stripe") {
        console.log("Initiating Stripe checkout...");
        console.log("Cart items:", cartItems);
        
        try {
          const response = await post("/checkout/session", {
            items: cartItems.map(item => ({
              id: item.id || item._id,
              name: item.name,
              price: item.price,
              qty: item.qty,
              imgSrc: item.imgSrc || item.image,
            })),
            email: user?.email,
          });

          console.log("Stripe response:", response);

          if (response && response.url) {
            // Redirect to Stripe Checkout
            window.location.href = response.url;
            return;
          } else {
            throw new Error("No checkout URL returned from server");
          }
        } catch (stripeError) {
          console.error("Stripe checkout error:", stripeError);
          
          // More detailed error handling
          let stripeErrorMsg = "Failed to initiate Stripe checkout.";
          
          if (stripeError.response?.data?.error) {
            stripeErrorMsg = stripeError.response.data.error;
          } else if (stripeError.message) {
            stripeErrorMsg = stripeError.message;
          }
          
          setError(stripeErrorMsg + " Please try again or use Cash on Delivery.");
          setLoading(false);
          return;
        }
      }

      // Cash on Delivery Flow
      const orderPayload = {
        userId: user.id || user._id,
        products: cartItems.map((item) => ({
          productId: item.id || item._id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          image: item.imgSrc || item.image,
        })),
        totalPrice: calculateTotal(),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        status: "pending",
      };

      await post("/orders", orderPayload);

      clearCart();
      router.push("/orders/success");
    } catch (err) {
      console.error("Checkout error:", err);
      
      let errorMessage = "Failed to place order. Please try again.";
      
      if (err.response) {
        if (err.response.data && typeof err.response.data === 'object' && err.response.data.error) {
           errorMessage = err.response.data.error;
        } else if (err.response.data && typeof err.response.data === 'string') {
           if (err.response.data.includes("<!DOCTYPE html>")) {
             errorMessage = "Server error. Please check your connection or try again later.";
           } else {
             errorMessage = err.response.data;
           }
        } else if (err.message) {
           errorMessage = err.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Form */}
          <div className="space-y-8">
            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <MapPin size={24} />
                </div>
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                  <CreditCard size={24} />
                </div>
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                  formData.paymentMethod === "cod" ? "border-blue-500 bg-blue-50/50" : "border-gray-200"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    Cash on Delivery (COD)
                  </span>
                  <Truck className="ml-auto text-gray-400" size={20} />
                </label>

                <label className={`flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                  formData.paymentMethod === "stripe" ? "border-purple-500 bg-purple-50/50" : "border-gray-200"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={formData.paymentMethod === "stripe"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    Pay with Stripe
                  </span>
                  <CreditCard className="ml-auto text-gray-400" size={20} />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                      <img
                        src={item.imgSrc || item.image || "/images/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded-tl-md">
                        x{item.qty}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${(Number(item.price) * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${Number(cartTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <button
                type="submit"
                form="checkout-form"
                disabled={loading || !user}
                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {formData.paymentMethod === "stripe" ? "Proceed to Stripe" : "Place Order"}
                    <ArrowLeft className="rotate-180" size={20} />
                  </>
                )}
              </button>
              
              {!user && (
                 <p className="text-xs text-center text-red-500 mt-2">
                   * You must be logged in to complete purchase
                 </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}