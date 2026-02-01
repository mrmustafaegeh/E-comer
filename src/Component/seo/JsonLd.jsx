export default function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function generateProductJsonLd(product, baseUrl) {
  const price = product.offerPrice || product.price;
  
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title || product.name,
    "image": [product.image],
    "description": product.description || "",
    "sku": product._id,
    "brand": {
      "@type": "Brand",
      "name": "QuickCart"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/products/${product.slug || product._id}`,
      "priceCurrency": "USD",
      "price": price,
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "priceValidUntil": new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0]
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.numReviews || 0
    } : undefined
  };
}

export function generateBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
}
