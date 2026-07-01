import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  prevLabel?: string;
  nextLabel?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl = '/',
  prevLabel = 'Anterior',
  nextLabel = 'Siguiente',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const url = new URL(baseUrl, 'http://placeholder');
    url.searchParams.set('page', String(page));
    return `${url.pathname}?${url.searchParams.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Paginación de propiedades"
      className="flex items-center justify-center gap-2 mt-12"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nordic bg-white border border-nordic/10 rounded-lg hover:border-mosque hover:text-mosque transition-all hover:shadow-sm"
        >
          <FiChevronLeft className="text-base" />
          {prevLabel}
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nordic-muted bg-white border border-nordic/10 rounded-lg opacity-40 cursor-not-allowed">
          <FiChevronLeft className="text-base" />
          {prevLabel}
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <Link
            key={page}
            href={buildHref(page)}
            className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-all ${
              page === currentPage
                ? 'bg-nordic text-white shadow-sm'
                : 'bg-white text-nordic border border-nordic/10 hover:border-mosque hover:text-mosque hover:shadow-sm'
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nordic bg-white border border-nordic/10 rounded-lg hover:border-mosque hover:text-mosque transition-all hover:shadow-sm"
        >
          {nextLabel}
          <FiChevronRight className="text-base" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nordic-muted bg-white border border-nordic/10 rounded-lg opacity-40 cursor-not-allowed">
          {nextLabel}
          <FiChevronRight className="text-base" />
        </span>
      )}
    </nav>
  );
}
