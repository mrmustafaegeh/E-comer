// src/components/common/ProductSkeleton.jsx
export default function ProductSkeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <div className="bg-white rounded-lg p-4 h-[520px]" />
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-12 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}
