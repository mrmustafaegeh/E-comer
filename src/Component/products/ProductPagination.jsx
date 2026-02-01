"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination({ page, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 text-gray-500 hover:text-black disabled:opacity-20 disabled:hover:text-gray-500 transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-2">
        {getPageNumbers().map((pageNum, index) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-gray-300"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[40px] h-10 flex items-center justify-center text-sm font-medium transition-all ${
                page === pageNum
                  ? "text-black border-b-2 border-black"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              {pageNum}
            </button>
          )
        )}
      </div>

      {/* Mobile Page Indicator */}
      <div className="sm:hidden text-sm font-medium text-gray-900 mx-4">
        {page} / {totalPages}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 text-gray-500 hover:text-black disabled:opacity-20 disabled:hover:text-gray-500 transition"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
