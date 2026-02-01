import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import ProductsClient from "./ProductsClient";
import { getProducts } from "../../services/productService";

export async function generateMetadata({ searchParams }) {
  const { search, category } = await searchParams;

  let title = "Products | E-Commerce Store";
  let description = "Browse our extensive collection of high-quality products.";

  if (category) {
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    title = `${formattedCategory} | E-Commerce Store`;
    description = `Shop the best ${category} products at competitive prices.`;
  }

  if (search) {
    title = `Search results for "${search}" | E-Commerce Store`;
    description = `Find exactly what you're looking for with our search results for "${search}".`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
  const page = Number(resolvedParams.page) || 1;
  const limit = 12; // Must match hook default
  const search = resolvedParams.search || "";
  const category = resolvedParams.category || "";
  const minPrice = resolvedParams.minPrice || "";
  const maxPrice = resolvedParams.maxPrice || "";

  const filters = {
    page,
    limit,
    search,
    category,
    minPrice,
    maxPrice,
  };

  // Prefetch using the service directly (Server-Side)
  await queryClient.prefetchQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsClient />
    </HydrationBoundary>
  );
}
