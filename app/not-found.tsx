import Link from "next/link";
import { Rule } from "@/components/ui/primitives";

/*
 * 404 — Sala Blanca.
 * Lo que cambió: se fue el icono en caja redondeada con fondo dorado y el bloque
 * centrado. El copy dejó de hablar de folios y tomos cuando el mundo dejó de ser
 * documental.
 */

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-tomo items-center px-4 pt-32 pb-20 sm:px-6 lg:px-10">
      <div className="w-full max-w-xl">
        <Rule weight="fuerte" />
        <p className="indicador tabular mt-5">404 · Página no encontrada</p>
        <h1 className="mt-4 font-display text-titulo font-normal text-tinta">
          No encontramos esta página.
        </h1>
        <p className="mt-5 max-w-[48ch] text-cuerpo text-tinta-media">
          La dirección que abriste no corresponde a ninguna propiedad del
          catálogo, o el inmueble fue retirado.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex h-12 items-center border border-tinta bg-tinta px-6 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
