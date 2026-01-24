// app/components/component/HeroProductSkeleton.js
export default function HeroProductSkeleton() {
  return (
    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl backdrop-blur-lg">
      <div className="animate-pulse">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="h-8 bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-32"></div>
          </div>
          <div className="h-12 w-12 bg-gray-700 rounded-lg"></div>
        </div>

        <div className="h-64 bg-gray-700 rounded-2xl mb-6"></div>

        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="space-y-2">
            <div className="h-6 bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-700 rounded w-16"></div>
          </div>
          <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
        </div>
      </div>

      {/* Skeleton floating badges */}
      <div className="absolute -top-3 -left-3">
        <div className="h-16 w-16 bg-gray-700 rounded-full"></div>
      </div>
      <div className="absolute -bottom-3 -right-3">
        <div className="h-12 w-12 bg-gray-700 rounded-full"></div>
      </div>
    </div>
  );
}
