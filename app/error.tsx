"use client";

import Link from "next/link";
import { Rule } from "@/components/ui/primitives";

/*
 * Error — Folio y Sello.
 * Lo que cambió: se fue el icono en caja redondeada con fondo bordó. El error se
 * anuncia en el lenguaje del mundo: la hoja no se pudo emitir, y se nombra la
 * recuperación.
 */

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-tomo items-center px-4 pt-32 pb-20 sm:px-6 lg:px-10">
      <div className="w-full max-w-xl">
        <Rule weight="fuerte" />
        <p className="indicador mt-5 text-laca">Error · Hoja no emitida</p>
        <h1 className="mt-4 font-display text-titulo font-normal text-tinta">
          No pudimos abrir esta hoja.
        </h1>
        <p className="mt-5 max-w-[48ch] text-cuerpo text-tinta-media">
          Ocurrió un error inesperado al cargar el contenido. Probá de nuevo; si
          persiste, volvé al índice.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center border border-tinta bg-tinta px-6 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="border-b border-transparent pb-1 text-menudo text-tinta-tenue transition-colors hover:border-tinta hover:text-tinta"
          >
            Volver al índice
          </Link>
        </div>
      </div>
    </main>
  );
}
