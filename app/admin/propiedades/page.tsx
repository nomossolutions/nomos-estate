"use server";

import {
  FiPlus,
  FiEyeOff,
  FiEye,
  FiEdit,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { revalidatePath } from "next/cache";

/*
 * Admin · Propiedades — Folio y Sello, modo Operate.
 *
 * Lo que cambió respecto del sistema viejo: se fueron los tres recuadros de
 * estadística con icono en círculo, las píldoras de estado con puntito de color,
 * la tabla de filas blancas con sombra al hover y la paginación con la página
 * activa en dorado.
 *
 * Regla de Operate que se aplica acá: la expresión no puede estorbar la tarea.
 * El estado se lee por sello y por tinta; el número de página activo se marca con
 * tinta plena, no con el acento de marca, para que el acento quede libre.
 *
 * Corrección de datos: `activeCount` e `inactiveCount` se calculaban sobre las 10
 * filas de la página actual pero se mostraban como totales. Ahora son dos
 * consultas de conteo reales.
 */

async function togglePropertyStatus(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  const currentStatus = formData.get("is_active") === "true";
  const supabase = await createClient();
  await supabase
    .from("properties")
    .update({ is_active: !currentStatus })
    .eq("id", id);
  revalidatePath("/admin/propiedades");
}

function numeroDePaginas(current: number, total: number): (number | string)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const p: (number | string)[] = [1];
  if (current > 3) p.push("…");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) p.push(i);
  if (current < total - 2) p.push("…");
  p.push(total);
  return p;
}

/* 44px es el objetivo táctil mínimo; el valor va explícito a propósito. */
const CELDA_PAGINA =
  "flex h-11 min-w-[44px] items-center justify-center rounded text-menudo transition-colors";

export default async function AdminPropertiesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  // Admin ve TODAS las propiedades (activas e inactivas)
  const { count } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true });

  const { count: activas } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  const totalListings = count || 0;
  const activeCount = activas || 0;
  const inactiveCount = totalListings - activeCount;
  const totalPages = totalListings ? Math.ceil(totalListings / limit) : 1;

  const { data: properties, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    return (
      <main className="mx-auto w-full max-w-tomo px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <p role="alert" className="border border-laca/40 bg-laca-tenue p-4 text-laca">
          Error al cargar propiedades
        </p>
      </main>
    );
  }

  const resumen = [
    { label: "Total de propiedades", valor: totalListings },
    { label: "Activas", valor: activeCount },
    { label: "Inactivas", valor: inactiveCount },
  ];

  return (
    <main className="mx-auto w-full max-w-tomo px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-6 border-t border-rule pt-5 sm:flex-row sm:items-end">
        <div>
          <span className="indicador text-tinta">Administración · Propiedades</span>
          <h1 className="mt-3 font-display text-titulo font-normal text-tinta">
            Mis propiedades
          </h1>
          <p className="mt-3 max-w-[52ch] text-menudo text-tinta-tenue">
            Gestioná el portafolio y su estado de publicación.
          </p>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="inline-flex h-12 shrink-0 items-center gap-2 border border-tinta bg-tinta px-5 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover"
        >
          <FiPlus aria-hidden="true" />
          Añadir propiedad
        </Link>
      </div>

      {/* Registro de totales: dato y regla, sin recuadro decorativo */}
      <dl className="mt-12 grid grid-cols-1 border-t border-rule sm:grid-cols-3 sm:gap-x-0">
        {resumen.map((celda) => (
          <div
            key={celda.label}
            className="flex items-baseline justify-between gap-x-8 gap-y-2 border-b border-rule py-5 sm:grid sm:grid-cols-[auto_1fr] sm:items-baseline sm:border-b-0 sm:border-r sm:px-8 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
          >
            <dt className="indicador">{celda.label}</dt>
            <dd className="tabular font-display text-titulo font-normal leading-none text-tinta">
              {celda.valor}
            </dd>
          </div>
        ))}
      </dl>

      {/* Listado */}
      <section className="mt-12" aria-label="Listado de propiedades">
        <div className="hidden grid-cols-12 gap-4 border-b border-tinta pb-3 pr-6 md:grid">
          <span className="col-span-6 indicador">Propiedad</span>
          <span className="col-span-2 indicador">Precio</span>
          <span className="col-span-2 indicador">Estado</span>
          <span className="col-span-2 indicador text-right">Acciones</span>
        </div>

        {properties?.map((property) => (
          <article
            key={property.id}
            className={`group grid grid-cols-1 items-center gap-4 border-b border-rule py-5 pr-6 transition-colors hover:bg-hoja-alta md:grid-cols-12 ${
              !property.is_active ? "opacity-60" : ""
            }`}
          >
            <div className="col-span-12 flex items-center gap-4 md:col-span-6">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden border border-rule bg-hoja-baja">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={property.title}
                  className="h-full w-full object-cover"
                  src={
                    property.images?.[0] ||
                    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400"
                  }
                />
                {!property.is_active && (
                  <span className="absolute inset-0 flex items-center justify-center bg-tinta/50">
                    <FiEyeOff className="text-hoja" aria-hidden="true" />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <Link href={`/properties/${property.slug}`}>
                  <h2 className="truncate font-display text-folio font-normal text-tinta transition-colors group-hover:text-laton">
                    {property.title}
                  </h2>
                </Link>
                <p className="truncate text-menudo text-tinta-tenue">
                  {property.location}
                </p>
                <p className="indicador tabular mt-1">
                  {property.beds || 0} dorm · {property.baths || 0} baños
                </p>
              </div>
            </div>

            <div className="col-span-6 md:col-span-2">
              <p className="tabular font-display text-precio leading-none text-tinta">
                ${property.price.toLocaleString("es-CO")}
              </p>
              <p className="indicador mt-1">
                {property.type === "rent" ? "Alquiler" : "Venta"}
              </p>
            </div>

            <div className="col-span-6 flex flex-col items-start gap-2 md:col-span-2">
              <span
                className={
                  property.is_active
                    ? "sello sello--certificado"
                    : "sello sello--reservado"
                }
              >
                {property.is_active ? "Publicada" : "Oculta"}
              </span>
              {property.is_featured && (
                <span className="indicador text-laton">Destacada</span>
              )}
            </div>

            <div className="col-span-12 flex items-center justify-end gap-1 md:col-span-2">
              {/* `slug || id`: el mismo fallback que usa el resto, y la ruta en
                  español como el resto del panel. */}
              <Link
                href={`/admin/propiedades/${property.slug || property.id}/editar`}
                className="flex h-11 w-11 items-center justify-center border border-transparent text-tinta-tenue transition-colors hover:border-rule-fuerte hover:text-tinta"
                title="Editar propiedad"
              >
                <FiEdit aria-hidden="true" />
                <span className="sr-only">Editar {property.title}</span>
              </Link>

              <form action={togglePropertyStatus}>
                <input type="hidden" name="id" value={property.id} />
                <input
                  type="hidden"
                  name="is_active"
                  value={String(property.is_active)}
                />
                <button
                  type="submit"
                  title={
                    property.is_active
                      ? "Ocultar propiedad"
                      : "Publicar propiedad"
                  }
                  className={`flex h-11 w-11 items-center justify-center border border-transparent transition-colors ${
                    property.is_active
                      ? "text-tinta-tenue hover:border-laca/40 hover:text-laca"
                      : "text-tinta-tenue hover:border-sage/40 hover:text-sage"
                  }`}
                >
                  {property.is_active ? (
                    <FiEyeOff aria-hidden="true" />
                  ) : (
                    <FiEye aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {property.is_active ? "Ocultar" : "Publicar"}{" "}
                    {property.title}
                  </span>
                </button>
              </form>
            </div>
          </article>
        ))}

        {(!properties || properties.length === 0) && (
          <div className="hoja mt-8 p-10 sm:p-14">
            <p className="font-display text-folio text-tinta">
              Todavía no hay propiedades cargadas.
            </p>
            <p className="mt-3 max-w-[46ch] text-menudo text-tinta-tenue">
              Cargá la primera para que aparezca en el catálogo público.
            </p>
            <Link
              href="/admin/propiedades/nueva"
              className="mt-7 inline-flex h-11 items-center border border-rule-fuerte px-5 text-menudo font-medium text-tinta transition-colors hover:border-tinta"
            >
              Añadir propiedad
            </Link>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <nav
            aria-label="Paginación de propiedades"
            className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
          >
            <p className="indicador tabular">
              Mostrando {from + 1}–{Math.min(to + 1, totalListings)} de{" "}
              {totalListings}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={`/admin/propiedades?page=${Math.max(1, page - 1)}`}
                aria-disabled={page === 1}
                className={`${CELDA_PAGINA} text-tinta-tenue hover:text-tinta ${
                  page === 1 ? "pointer-events-none opacity-40" : ""
                }`}
              >
                <FiChevronLeft aria-hidden="true" />
                <span className="sr-only">Página anterior</span>
              </Link>

              {numeroDePaginas(page, totalPages).map((p, idx) =>
                p === "…" ? (
                  <span
                    key={`e-${idx}`}
                    aria-hidden="true"
                    className="w-6 select-none text-center text-menudo text-tinta-tenue"
                  >
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={`/admin/propiedades?page=${p}`}
                    aria-current={page === p ? "page" : undefined}
                    className={`${CELDA_PAGINA} tabular ${
                      page === p
                        ? "border border-tinta font-medium text-tinta"
                        : "border border-transparent text-tinta-tenue hover:text-tinta"
                    }`}
                  >
                    {p}
                  </Link>
                ),
              )}

              <Link
                href={`/admin/propiedades?page=${Math.min(totalPages, page + 1)}`}
                aria-disabled={page === totalPages}
                className={`${CELDA_PAGINA} text-tinta-tenue hover:text-tinta ${
                  page === totalPages ? "pointer-events-none opacity-40" : ""
                }`}
              >
                <FiChevronRight aria-hidden="true" />
                <span className="sr-only">Página siguiente</span>
              </Link>
            </div>
          </nav>
        )}
      </section>
    </main>
  );
}
