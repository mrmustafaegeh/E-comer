export default function FeaturedCategories() {
  return (
    <section className="relative bg-slate-900 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Featured
          </span>
          <span className="block">Categories</span>
        </h2>

        <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          Explore our curated collection of premium products
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Electronics", icon: "💻" },
            { name: "Fashion", icon: "👔" },
            { name: "Home & Living", icon: "🏠" },
          ].map((c, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-slate-800/60 border border-white/10 backdrop-blur text-center"
            >
              <div className="text-5xl mb-4">{c.icon}</div>
              <h3 className="text-xl font-bold text-white">{c.name}</h3>
              <p className="text-gray-400 text-sm mt-2">
                Discover amazing deals and new arrivals
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
