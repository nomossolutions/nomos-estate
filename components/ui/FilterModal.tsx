"use client";

import { FiX, FiMapPin, FiChevronDown, FiMinus, FiPlus, FiArrowRight } from "react-icons/fi";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

/*
 * FilterModal — Folio y Sello.
 *
 * Bug corregido: el overlay era `fixed inset-0 backdrop-blur-sm` SIN color de
 * fondo, así que el modal no tenía velo — la página de atrás quedaba legible y
 * el blur no cubría nada. Ahora el velo es tinta al 55%.
 *
 * Lo que cambió: se fue la pila de radios mezclados (rounded-full en los
 * contadores, rounded-lg en los campos, rounded en el botón), el `shadow-2xl`
 * del panel y los pills de comodidades.
 *
 * NOTA SOBRE COMODIDADES: la sección "Comodidades" se quitó a propósito. Sus
 * checkboxes escribían `amenities` en la URL, pero ese parámetro NUNCA se filtra
 * en la consulta a Supabase (ver app/page.tsx), así que el control mentía: el
 * usuario marcaba comodidades y no pasaba nada. Se retiró el control falso y el
 * filtrado real queda como tarea aparte, para no mezclar un cambio funcional con
 * el rediseño.
 */

interface FilterInitialValues {
  location: string;
  minPrice: string;
  maxPrice: string;
  /** Slug de la categoría, no su nombre: es lo que viaja en la URL. */
  categoria: string;
  beds: number;
  baths: number;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalResults?: number;
  initialFilters: FilterInitialValues;
  /**
   * Categorías que definió el admin en el panel. Llegan del servidor: la lista ya
   * no vive escrita en este archivo. Si la migración no corrió, llega vacía y el
   * control simplemente no se muestra.
   */
  categorias?: { id: string; name: string; slug: string }[];
}

const CAMPO =
  "w-full rounded border border-rule-fuerte bg-hoja-alta px-4 py-3 text-cuerpo text-tinta placeholder:text-tinta-tenue/70 transition-colors focus:border-tinta focus:outline-none";

/*
 * Contenedor: monta el diálogo solo cuando está abierto y lo resetea por `key`
 * si cambian los filtros entrantes. Así el formulario nace con el estado inicial
 * correcto y no hace falta un efecto que sincronice estado (que era el patrón
 * "setState dentro de un effect": renders en cascada evitables).
 */
export default function FilterModal({ isOpen, ...props }: FilterModalProps) {
  if (!isOpen) return null;

  const clave = [
    props.initialFilters.location,
    props.initialFilters.minPrice,
    props.initialFilters.maxPrice,
    props.initialFilters.categoria,
    props.initialFilters.beds,
    props.initialFilters.baths,
  ].join("|");

  return <FilterDialog key={clave} isOpen {...props} />;
}

function FilterDialog({
  onClose,
  totalResults = 0,
  initialFilters,
  categorias = [],
}: FilterModalProps) {
  const router = useRouter();

  const [location, setLocation] = useState(initialFilters.location);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [categoria, setCategoria] = useState(initialFilters.categoria);
  const [beds, setBeds] = useState(initialFilters.beds);
  const [baths, setBaths] = useState(initialFilters.baths);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    /* Viaja el slug, no el nombre: sobrevive a que renombren la categoría. */
    if (categoria) params.set("categoria", categoria);
    if (beds > 0) params.set("beds", beds.toString());
    if (baths > 0) params.set("baths", baths.toString());

    params.delete("page");

    router.push(`/?${params.toString()}#propiedades`);
    onClose();
  };

  const handleClear = () => {
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setCategoria("");
    setBeds(0);
    setBaths(0);
    router.push("/#propiedades");
    onClose();
  };

  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  /* El diálogo solo existe montado cuando está abierto: al montar lleva el foco
     adentro y al desmontar lo devuelve a donde estaba. */
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    const modal = modalRef.current;
    if (modal) {
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length > 0) focusable[0].focus();
    }
    return () => previousFocusRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  const contador = (valor: number, set: (n: number) => void, etiqueta: string) => (
    <div className="flex items-center justify-between gap-4 border-b border-rule py-4">
      <span className="text-cuerpo text-tinta">{etiqueta}</span>
      <div className="flex items-center border border-rule-fuerte">
        <button
          type="button"
          onClick={() => set(Math.max(0, valor - 1))}
          disabled={valor <= 0}
          aria-label={`Reducir ${etiqueta.toLowerCase()}`}
          className="flex h-11 w-11 items-center justify-center text-tinta transition-colors hover:bg-hoja-baja disabled:opacity-30"
        >
          <FiMinus />
        </button>
        <span
          aria-live="polite"
          className="tabular w-10 border-x border-rule-fuerte text-center text-cuerpo text-tinta"
        >
          {valor > 0 ? valor : "—"}
        </span>
        <button
          type="button"
          onClick={() => set(valor + 1)}
          aria-label={`Aumentar ${etiqueta.toLowerCase()}`}
          className="flex h-11 w-11 items-center justify-center text-tinta transition-colors hover:bg-hoja-baja"
        >
          <FiPlus />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Velo: existía sin color de fondo — ese era el bug. */}
      <div
        className="fixed inset-0 z-[100] bg-tinta/55"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Filtros de búsqueda"
          onKeyDown={handleKeyDown}
          className="hoja pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden"
        >
          <header className="flex items-center justify-between border-b border-tinta px-5 py-5 sm:px-8">
            <h2 className="font-display text-folio font-normal text-tinta">
              Filtros
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar filtros"
              className="flex h-11 w-11 items-center justify-center border border-rule-fuerte text-tinta transition-colors hover:border-tinta"
            >
              <FiX />
            </button>
          </header>

          <div className="hide-scroll flex-1 space-y-10 overflow-y-auto px-5 py-8 sm:px-8">
            {/* Ubicación */}
            <section>
              <label
                htmlFor="filter-location"
                className="indicador mb-3 block"
              >
                Ubicación
              </label>
              <div className="relative">
                <FiMapPin
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tinta-tenue"
                />
                <input
                  id="filter-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ciudad, barrio o dirección"
                  className={`${CAMPO} pl-11`}
                />
              </div>
            </section>

            {/* Rango de precio */}
            <section>
              <span className="indicador mb-3 block">Rango de precio</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="filter-min-price"
                    className="indicador mb-2 block"
                  >
                    Mínimo
                  </label>
                  <div className="flex items-center border border-rule-fuerte bg-hoja-alta px-4 py-3 focus-within:border-tinta">
                    <span aria-hidden="true" className="mr-1 text-tinta-tenue">
                      $
                    </span>
                    <input
                      id="filter-min-price"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                      className="tabular w-full border-0 bg-transparent p-0 text-cuerpo text-tinta placeholder:text-tinta-tenue/70 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="filter-max-price"
                    className="indicador mb-2 block"
                  >
                    Máximo
                  </label>
                  <div className="flex items-center border border-rule-fuerte bg-hoja-alta px-4 py-3 focus-within:border-tinta">
                    <span aria-hidden="true" className="mr-1 text-tinta-tenue">
                      $
                    </span>
                    <input
                      id="filter-max-price"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Sin tope"
                      className="tabular w-full border-0 bg-transparent p-0 text-cuerpo text-tinta placeholder:text-tinta-tenue/70 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Categoría: las opciones las define el admin en el panel */}
            {categorias.length > 0 && (
              <section>
                <label htmlFor="filter-categoria" className="indicador mb-3 block">
                  Categoría
                </label>
                <div className="relative">
                  <select
                    id="filter-categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className={`${CAMPO} cursor-pointer appearance-none pr-11`}
                  >
                    <option value="">Todas las categorías</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-tinta-tenue"
                  />
                </div>
              </section>
            )}

            {/* Ambientes */}
            <section>
              <span className="indicador mb-1 block">Ambientes</span>
              {contador(beds, setBeds, "Dormitorios")}
              {contador(baths, setBaths, "Baños")}
            </section>
          </div>

          <footer className="flex items-center justify-between gap-4 border-t border-rule px-5 py-5 sm:px-8">
            <button
              type="button"
              onClick={handleClear}
              className="border-b border-transparent pb-1 text-menudo text-tinta-tenue transition-colors hover:border-tinta hover:text-tinta"
            >
              Limpiar filtros
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex h-12 items-center gap-2 border border-tinta bg-tinta px-5 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover"
            >
              <span className="hidden sm:inline">
                {totalResults > 0
                  ? `Mostrar ${totalResults} propiedades`
                  : "Mostrar propiedades"}
              </span>
              <span className="sm:hidden">
                {totalResults > 0 ? `${totalResults} prop.` : "Aplicar"}
              </span>
              <FiArrowRight aria-hidden="true" />
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
