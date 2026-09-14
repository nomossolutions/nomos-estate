import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { Rule } from "./ui/primitives";

/*
 * Pagination — Folio y Sello.
 *
 * Lo que cambió: se fue la fila centrada de botones blancos con sombra al hover.
 * Paginar un tomo es pasar de hoja, así que ahora hay una sola línea: el número
 * de folio actual contra el total, con las dos acciones al margen. La página
 * activa se marca con la forma de la línea, no con un relleno.
 */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
  prevLabel?: string;
  nextLabel?: string;
  searchString?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl = "/",
  prevLabel = "Anterior",
  nextLabel = "Siguiente",
  searchString = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchString);
    params.set("page", String(page));
    return `${baseUrl}?${params.toString()}#propiedades`;
  };

  const hayAnterior = currentPage > 1;
  const haySiguiente = currentPage < totalPages;

  const linkBase =
    "group inline-flex items-center gap-2 border-b border-transparent pb-1 text-menudo font-medium transition-colors";

  return (
    <nav aria-label="Paginación de propiedades" className="mt-16">
      <Rule />
      <div className="flex items-center justify-between gap-4 pt-5">
        {hayAnterior ? (
          <Link
            href={buildHref(currentPage - 1)}
            rel="prev"
            className={`${linkBase} text-tinta hover:border-tinta`}
          >
            <FiArrowLeft
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            {prevLabel}
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={`${linkBase} text-tinta-tenue opacity-40`}
          >
            <FiArrowLeft aria-hidden="true" />
            {prevLabel}
          </span>
        )}

        <p className="indicador tabular text-tinta" aria-live="polite">
          Página {currentPage} de {totalPages}
        </p>

        {haySiguiente ? (
          <Link
            href={buildHref(currentPage + 1)}
            rel="next"
            className={`${linkBase} text-tinta hover:border-tinta`}
          >
            {nextLabel}
            <FiArrowRight
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className={`${linkBase} text-tinta-tenue opacity-40`}
          >
            {nextLabel}
            <FiArrowRight aria-hidden="true" />
          </span>
        )}
      </div>
    </nav>
  );
}
