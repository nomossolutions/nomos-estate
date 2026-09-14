import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Rule } from "@/components/ui/primitives";

/*
 * Admin · Panel — Folio y Sello, modo Operate.
 *
 * Esta pantalla NO es un tablero de métricas decorativas. Aplica la regla del
 * sistema: no se muestra ningún número que el sistema no pueda calcular.
 * Todo lo de acá sale de un `count` real sobre `properties` o del RPC
 * `get_admin_users`.
 *
 * Lo que deliberadamente no hay: gráficos de tendencia (no hay histórico
 * agregable por la API de cliente de Supabase), ingresos, conversión, ni
 * "propiedades por agente" — esos datos no existen.
 */

const ACCIONES = [
  {
    href: "/admin/propiedades/nueva",
    titulo: "Añadir propiedad",
    detalle: "Cargar un inmueble nuevo al catálogo.",
  },
  {
    href: "/admin/usuarios/asignar-rol",
    titulo: "Asignar rol",
    detalle: "Dar acceso a un usuario ya registrado.",
  },
];

export default async function AdminPanelPage() {
  const supabase = await createClient();

  const [
    { count: total },
    { count: activas },
    { count: destacadas },
    { data: usuarios },
    { data: recientes },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("properties")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),
    supabase.rpc("get_admin_users"),
    supabase
      .from("properties")
      .select("id, title, slug, location, price, is_active")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalPropiedades = total ?? 0;
  const totalActivas = activas ?? 0;
  const totalDestacadas = destacadas ?? 0;
  const totalUsuarios = usuarios?.length ?? 0;
  const totalAdmins = usuarios?.filter((u) => u.role === "admin").length ?? 0;

  /* Todo número de acá tiene una consulta detrás. */
  const metricas = [
    { label: "Propiedades", valor: totalPropiedades },
    { label: "Publicadas", valor: totalActivas },
    { label: "Ocultas", valor: totalPropiedades - totalActivas },
    { label: "Destacadas", valor: totalDestacadas },
    { label: "Usuarios", valor: totalUsuarios },
    { label: "Administradores", valor: totalAdmins },
  ];

  return (
    <main className="mx-auto w-full max-w-tomo px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      {/* Encabezado */}
      <div className="border-t border-rule pt-5">
        <span className="indicador text-tinta">Administración · Panel</span>
        <h1 className="mt-3 font-display text-titulo font-normal text-tinta">
          Panel
        </h1>
        <p className="mt-3 max-w-[54ch] text-menudo text-tinta-tenue">
          El estado del catálogo y del equipo, más los accesos directos a la
          gestión.
        </p>
      </div>

      {/* Registro de métricas */}
      <section aria-labelledby="metricas" className="mt-12">
        <h2 id="metricas" className="sr-only">
          Métricas del catálogo y del equipo
        </h2>
        <dl className="grid grid-cols-1 gap-x-8 border-t border-rule lg:grid-cols-6 lg:gap-x-0">
          {metricas.map((m) => (
            <div
              key={m.label}
              className="flex items-baseline justify-between gap-x-8 gap-y-2 border-b border-rule py-5 lg:grid lg:grid-cols-[auto_1fr] lg:items-baseline lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <dt className="indicador">{m.label}</dt>
              <dd className="tabular font-display text-titulo font-normal leading-none text-tinta">
                {m.valor}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Últimas propiedades */}
        <section className="lg:col-span-7" aria-labelledby="recientes">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="recientes"
              className="font-display text-folio font-normal text-tinta"
            >
              Últimas propiedades
            </h2>
            <Link
              href="/admin/propiedades"
              className="border-b border-transparent pb-1 text-menudo text-tinta-tenue transition-colors hover:border-tinta hover:text-tinta"
            >
              Ver todas
            </Link>
          </div>

          <Rule weight="fuerte" className="mt-4" />

          {recientes && recientes.length > 0 ? (
            <ul>
              {recientes.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 border-b border-rule py-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/properties/${p.slug}`}
                      className="block truncate font-display text-folio font-normal text-tinta transition-colors hover:text-laton"
                    >
                      {p.title}
                    </Link>
                    <p className="truncate text-menudo text-tinta-tenue">
                      {p.location}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="tabular font-display text-precio leading-none text-tinta">
                      ${p.price.toLocaleString("es-CO")}
                    </p>
                    <p className="indicador mt-1">
                      {p.is_active ? "Publicada" : "Oculta"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-menudo text-tinta-tenue">
              Todavía no hay propiedades cargadas.
            </p>
          )}
        </section>

        {/* Accesos directos */}
        <section className="lg:col-span-5" aria-labelledby="acciones">
          <h2
            id="acciones"
            className="font-display text-folio font-normal text-tinta"
          >
            Accesos directos
          </h2>
          <Rule weight="fuerte" className="mt-4" />

          <ul className="mt-5 space-y-3">
            {ACCIONES.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="block border border-rule-fuerte p-5 transition-colors hover:border-tinta hover:bg-hoja-alta"
                >
                  <span className="text-menudo font-medium text-tinta">
                    {a.titulo}
                  </span>
                  <span className="mt-1 block text-menudo text-tinta-tenue">
                    {a.detalle}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
