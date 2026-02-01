import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import ProductsClient from "./ProductsClient";
import { getProducts } from "../../services/productService";
import JsonLd, { generateBreadcrumbJsonLd } from "../../Component/seo/JsonLd";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every minute

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const { search, category } = resolvedParams;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quickcart.com";
  const canonical = `${baseUrl}/products${category ? `?category=${category}` : ""}`;

  let title = "The Collection | Premium Tech Assets";
  let description = "Browse our curated archive of premium digital and physical assets for the modern world.";

  if (category) {
    const term = category.charAt(0).toUpperCase() + category.slice(1);
    title = `${term} Collection | Premium Tech Assets`;
    description = `Discover our high-performance ${category} products. Quality guaranteed in every asset.`;
  }

  if (search) {
    title = `Searching for "${search}" | Assets Archive`;
  }

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "QuickCart Identity Console",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProductsPage({ searchParams }) {
  const queryClient = new QueryClient();
  const resolvedParams = await searchParams;
  
  const filters = {
    page: Math.max(1, parseInt(resolvedParams.page) || 1),
    limit: 12,
    search: resolvedParams.search || "",
    category: resolvedParams.category || "",
    minPrice: resolvedParams.minPrice || "",
    maxPrice: resolvedParams.maxPrice || "",
    sort: resolvedParams.sort || "newest"
  };

  // Prefetch for SSR Hydration
  await queryClient.prefetchQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://quickcart.com";
  const breadcrumbs = [
    { name: "Home", item: baseUrl },
    { name: "Collection", item: `${baseUrl}/products` }
  ];
  if (filters.category) {
    breadcrumbs.push({ name: filters.category, item: `${baseUrl}/products?category=${filters.category}` });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JsonLd data={generateBreadcrumbJsonLd(breadcrumbs)} />
      <ProductsClient />
    </HydrationBoundary>
  );
}
