function FeaturedProductsWithQueryImpl({ addToCart }) {
  const { data, isLoading, error } = useFeaturedProducts();

  if (isLoading) return <FeaturedProductsSkeleton />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load featured products</p>
      </div>
    );
  }

  const products = data?.products || [];
  return <FeaturedProducts products={products} addToCart={addToCart} />;
}
