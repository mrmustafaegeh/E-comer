import HeroSlider from "../Component/slider/HeroSlider";
import FeaturedProductsClient from "../Component/features/FeaturedProductsClient";
import dynamic from "next/dynamic";

export default function HomePage() {
  return (
    <main className="bg-gray-50">
      <section className="relative min-h-[600px]">
        <HeroSlider />
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <FeaturedProductsClient />
      </section>
    </main>
  );
}
