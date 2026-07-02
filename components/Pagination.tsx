import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  prevLabel?: string;
  nextLabel?: string;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | 'ellipsis')[] = [1];
  if (current > 3) pages.push('ellipsis');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
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

  const pages = getPageNumbers(currentPage, totalPages);
  const btnClass = 'flex items-center justify-center text-sm font-medium rounded-lg transition-all min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] px-2';

  return (
    <nav
      aria-label="Paginación de propiedades"
      className="flex items-center justify-center gap-1.5 md:gap-2 mt-12"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className={`${btnClass} gap-1 px-3 md:px-4 py-2 text-nordic bg-white border border-nordic/10 rounded-lg hover:border-mosque hover:text-mosque hover:shadow-sm`}
        >
          <FiChevronLeft className="text-base" />
          <span className="hidden sm:inline">{prevLabel}</span>
        </Link>
      ) : (
        <span className={`${btnClass} gap-1 px-3 md:px-4 py-2 text-nordic-muted bg-white border border-nordic/10 rounded-lg opacity-40 cursor-not-allowed`}>
          <FiChevronLeft className="text-base" />
          <span className="hidden sm:inline">{prevLabel}</span>
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="w-6 md:w-9 text-center text-nordic-muted text-sm select-none">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              className={`${btnClass} ${
                page === currentPage
                  ? 'bg-nordic text-white shadow-sm'
                  : 'bg-white text-nordic border border-nordic/10 hover:border-mosque hover:text-mosque hover:shadow-sm'
              }`}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className={`${btnClass} gap-1 px-3 md:px-4 py-2 text-nordic bg-white border border-nordic/10 rounded-lg hover:border-mosque hover:text-mosque hover:shadow-sm`}
        >
          <span className="hidden sm:inline">{nextLabel}</span>
          <FiChevronRight className="text-base" />
        </Link>
      ) : (
        <span className={`${btnClass} gap-1 px-3 md:px-4 py-2 text-nordic-muted bg-white border border-nordic/10 rounded-lg opacity-40 cursor-not-allowed`}>
          <span className="hidden sm:inline">{nextLabel}</span>
          <FiChevronRight className="text-base" />
        </span>
      )}
    </nav>
  );
}
