"use client";

import { useState, FormEvent, useMemo } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import FilterModal from "./ui/FilterModal";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import heroimg from "@/public/heroimg2.jpg";

/*
 * Hero — Folio y Sello.
 *
 * Lo que cambió y por qué:
 *  - Se fue el eyebrow "— B I E N E S R A Í C E S —": el craft floor lo prohíbe,
 *    el título se sostiene solo.
 *  - Se fue el panel glass flotante y las tabs de categoría glass: el buscador
 *    ahora es una fila de índice con línea base, el gesto de archivo del mundo.
 *  - Se fue el `min-h-dvh` centrado: la composición es asimétrica, la foto entra
 *    a sangre y el rail de margen lleva la serie. La acción primaria va al
 *    margen izquierdo, nunca centrada.
 */

interface HeroDict {
  title_start: string;
  title_highlight: string;
  title_end: string;
  subtitle: string;
  search_placeholder: string;
  search_button: string;
}

interface HeroProps {
  dict: HeroDict;
  totalResults?: number;
  /** Propiedades publicadas en alquiler: alimenta la línea de catálogo. */
  totalAlquiler?: number;
  /** Categorías definidas por el admin: las opciones del filtro. */
  categorias?: { id: string; name: string; slug: string }[];
}

export default function Hero({
  dict,
  totalResults = 0,
  totalAlquiler = 0,
  categorias = [],
}: HeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("location") || "",
  );

  const filterInitialValues = useMemo(
    () => ({
      location: searchParams.get("location") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      categoria: searchParams.get("categoria") || "",
      beds: parseInt(searchParams.get("beds") || "0", 10),
      baths: parseInt(searchParams.get("baths") || "0", 10),
    }),
    [searchParams],
  );

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("location", searchQuery.trim());
    } else {
      params.delete("location");
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  const enVenta = Math.max(0, totalResults - totalAlquiler);

  return (
    <section id="hero" className="relative w-full">
      {/* ------------------------------------------------------------------
          PRIMER VIEWPORT — la tesis.
          La fotografía es la obra: entra a sangre, sin rail, sin marco y sin
          nada que le compita. La fila de búsqueda se apoya sobre su borde
          inferior.
      ------------------------------------------------------------------ */}
      <div>
        <div className="relative h-[52vh] min-h-[19rem] w-full overflow-hidden md:h-[62vh]">
          <Image
            alt="Conjunto residencial contemporáneo con balcones y jardín"
            src={heroimg}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Velo: solo para legibilidad de la fila de índice, no decoración. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-tinta/85 via-tinta/35 to-tinta/10"
          />

          {/* Fila de índice del buscador, anclada al pie de la foto. */}
          <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 lg:px-10">
            <form
              onSubmit={handleSearch}
              role="search"
              className="hoja flex flex-col gap-2 p-2 md:flex-row md:items-center"
            >
              <div className="relative flex-1">
                <label htmlFor="hero-search" className="sr-only">
                  {dict.search_placeholder}
                </label>
                <FiSearch
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tinta-tenue"
                />
                <input
                  id="hero-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dict.search_placeholder}
                  className="h-12 w-full border-0 border-b border-rule bg-transparent pl-11 pr-4 text-cuerpo text-tinta placeholder:text-tinta-tenue focus:border-tinta focus:outline-none md:h-14"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(true)}
                  className="inline-flex h-12 items-center justify-center gap-2 border border-rule-fuerte px-4 text-menudo font-medium text-tinta transition-colors hover:border-tinta md:h-14"
                >
                  <FiSliders aria-hidden="true" />
                  Filtros
                </button>
                <button
                  type="submit"
                  className="inline-flex h-12 flex-1 items-center justify-center border border-tinta bg-tinta px-6 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover md:h-14 md:flex-none"
                >
                  {dict.search_button}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ------------------------------------------------------------------
            Titular y estado del catálogo. Sobre el lienzo, alineados al margen.
            El titular es la única pieza de escala display de la página.
        ------------------------------------------------------------------ */}
        <div className="mx-auto max-w-tomo px-4 pb-10 pt-12 sm:px-6 lg:px-10 lg:pb-16 lg:pt-16">
          <h1 className="max-w-[19ch] font-display text-display font-normal text-tinta">
            {dict.title_start}
            <em className="not-italic text-laton">{dict.title_highlight}</em>
            {dict.title_end}
          </h1>

          <p className="mt-6 max-w-[46ch] text-cuerpo text-tinta-media">
            {dict.subtitle}
          </p>

          {/* ------------------------------------------------------------------
              Estado del catálogo, en lugar de un filtro de tipo.

              Por qué se retiró el filtro: sus ejes (Casa, Apartamento, Villa,
              Penthouse) se pasaban a la consulta como `title.ilike`, es decir
              buscaban esa palabra en el TÍTULO de la propiedad — el modelo solo
              tiene `type` = venta/alquiler, así que no existía un filtro por
              categoría. Un control que parece filtrar y en realidad busca texto
              es peor que no tenerlo. Además se solapaba con el filtro de
              operación que ya vive en la sección del catálogo.

              En su lugar va un dato que el sistema sí puede calcular y que
              orienta al visitante: cuánto hay y en qué proporción.
          ------------------------------------------------------------------ */}
          <dl className="mt-12 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-rule pt-6">
            <div className="flex items-baseline gap-2.5">
              <dt className="indicador">En el catálogo</dt>
              <dd className="tabular font-display text-precio leading-none text-tinta">
                {totalResults}
              </dd>
            </div>
            <div className="flex items-baseline gap-2.5">
              <dt className="indicador">En venta</dt>
              <dd className="tabular font-display text-precio leading-none text-tinta">
                {enVenta}
              </dd>
            </div>
            <div className="flex items-baseline gap-2.5">
              <dt className="indicador">En alquiler</dt>
              <dd className="tabular font-display text-precio leading-none text-tinta">
                {totalAlquiler}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filterInitialValues}
        totalResults={totalResults}
        categorias={categorias}
      />
    </section>
  );
}
