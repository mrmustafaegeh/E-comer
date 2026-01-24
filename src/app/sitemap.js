import clientPromise from "@/lib/mongodb";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://example.com";

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Fetch products for dynamic URLs
    const products = await db
      .collection("products")
      .find({}, { projection: { slug: 1, updatedAt: 1 } })
      .toArray();

    const productEntries = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // Static pages
    const staticPages = [
      "",
      "/products",
      "/about",
      "/contact",
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: route === "" ? 1.0 : 0.8,
    }));

    return [...staticPages, ...productEntries];
  } catch (e) {
    console.error("Sitemap generation error:", e);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];
  }
}
