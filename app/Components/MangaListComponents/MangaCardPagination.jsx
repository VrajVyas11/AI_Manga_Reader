import  { useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BottomPagination = ({ currentPage, totalPages, onPageChange,onLoadMore,loadMoreMangas }) => {
  const getVisiblePages = useCallback(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, 'gap1');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('gap2', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center space-x-1 mt-8 gap-3" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center  justify-center w-14 h-14 rounded-md border transition-colors ${
          currentPage === 1
            ? 'border-gray-800 text-gray-600 cursor-not-allowed'
            : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white hover:bg-gray-800'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((page, index) => {
        if (typeof page === 'string') {
          return (
            <span
              key={page}
              className="flex items-center justify-center w-14 h-14 text-gray-500"
            >
              ⋯
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-14 h-14 rounded-md border text-sm font-medium transition-colors ${
              page === currentPage
                ? 'border-white bg-white text-black'
                : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white hover:bg-gray-800'
            }`}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center  w-14 h-14 rounded-md border transition-colors ${
          currentPage === totalPages
            ? 'border-gray-800 text-gray-600 cursor-not-allowed'
            : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white hover:bg-gray-800'
        }`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default BottomPagination