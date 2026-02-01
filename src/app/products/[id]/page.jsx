import { getProductById } from "../../../services/productService";
import ProductDetailClient from "../../../Component/products/ProductDetailClient";
import JsonLd, { generateProductJsonLd } from "../../../Component/seo/JsonLd";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) return { title: "Product Not Found" };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quickcart.com';

  return {
    title: `${product.title} | Assets Archive`,
    description: product.description || `Buy ${product.title} at the best price on QuickCart.`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://quickcart.com';

  return (
    <main className="min-h-screen bg-white">
      <JsonLd 
        data={generateProductJsonLd(
          product, 
          baseUrl
        )} 
      />
      
      <ProductDetailClient product={product} />

      {/* Recommended Products or Reviews could go here */}
    </main>
  );
}
