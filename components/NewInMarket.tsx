"use client";

import PropertyCard from "./ui/PropertyCard";
import Pagination from "./Pagination";
import { SectionHeading } from "./ui/primitives";
import { Property } from "@/types/property";
import content from "@/lib/i18n";
import { useRouter, useSearchParams } from "next/navigation";

/*
 * NewInMarket — Folio y Sello.
 *
 * Lo que cambió: se fue el header centrado con la hairline dorada debajo, las
 * tabs en píldora blanca y la grilla de tarjetas flotantes. Ahora el encabezado
 * va al margen con su índice colgando, los ejes de operación se leen por forma
 * de línea, y la grilla son láminas numeradas que siguen la foliación real del
 * catálogo (la serie no se reinicia en cada página).
 */

interface NewInMarketProps {
  properties: Property[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

const OPS = [
  { value: "", label: "Todas" },
  { value: "sale", label: "Comprar" },
  { value: "rent", label: "Alquilar" },
] as const;

const NewInMarket = ({
  properties,
  totalCount,
  currentPage,
  pageSize,
}: NewInMarketProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentOperation = searchParams.get("operation") || "";

  const handleOperationChange = (operation: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (operation) {
      params.set("operation", operation);
    } else {
      params.delete("operation");
    }
    params.delete("page");
    router.push(`/?${params.toString()}#propiedades`);
  };

  return (
    <section id="propiedades" className="scroll-mt-24 py-16 md:py-24">
      <SectionHeading
        title={content.common.new_in_market}
        measure="Oportunidades frescas agregadas esta semana."
        action={
          <div
            role="group"
            aria-label="Filtrar por operación"
            className="mt-6 flex gap-7 sm:mt-0"
          >
            {OPS.map((op) => {
              const activa = currentOperation === op.value;
              return (
                <button
                  key={op.label}
                  type="button"
                  onClick={() => handleOperationChange(op.value)}
                  aria-pressed={activa}
                  className="group flex min-w-16 flex-col items-start gap-2"
                >
                  <span
                    className={`text-menudo transition-colors ${
                      activa
                        ? "text-tinta"
                        : "text-tinta-tenue group-hover:text-tinta"
                    }`}
                  >
                    {op.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={
                      activa
                        ? "marca-linea--activa"
                        : "marca-linea transition-colors group-hover:bg-rule-fuerte"
                    }
                  />
                </button>
              );
            })}
          </div>
        }
      />

      {properties.length === 0 ? (
        <div className="hoja mt-12 p-10 sm:p-16">
          <p className="font-display text-folio text-tinta">
            No encontramos propiedades con esta búsqueda.
          </p>
          <p className="mt-3 max-w-[46ch] text-menudo text-tinta-tenue">
            Probá quitar algún filtro o buscar por otra localidad.
          </p>
          <button
            type="button"
            onClick={() => router.push("/#propiedades")}
            className="mt-7 inline-flex h-11 items-center border border-rule-fuerte px-5 text-menudo font-medium text-tinta transition-colors hover:border-tinta"
          >
            Limpiar la búsqueda
          </button>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/"
        prevLabel={content.common.previous}
        nextLabel={content.common.next}
        searchString={searchParams.toString()}
      />
    </section>
  );
};

export default NewInMarket;
