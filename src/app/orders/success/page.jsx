"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Fire confetti on load
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. We have received your order and will contact you for delivery.
        </p>

        <div className="space-y-3">
          <Link
            href="/products"
            className="block w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
