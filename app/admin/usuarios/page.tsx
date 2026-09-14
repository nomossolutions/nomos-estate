import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ToggleRoleButton from "@/components/admin/ToggleRoleButton";
import { UserSearch, UserTabs } from "@/components/admin/UserFilters";

/*
 * Admin · Usuarios — Folio y Sello, modo Operate.
 *
 * Lo que cambió:
 *  - Se fue la columna "Rendimiento" con "Propiedades: -" y "Nivel de Acceso:
 *    Nivel 5 / Nivel 1". Nada de eso existe en los datos: el nivel de acceso era
 *    un número inventado a partir del rol, y "Propiedades" siempre mostraba un
 *    guion. Una tabla que declara métricas que no puede calcular es peor que una
 *    que no las muestra.
 *  - Se fue el puntito verde con "Activo": el estado se mostraba fijo para todos
 *    los usuarios porque no hay campo de estado en `user_roles`.
 *  - Se fueron las filas tipo tarjeta con sombra y el avatar en círculo con
 *    doble anillo blanco: ahora es una tabla de registro con reglas de 1px y el
 *    rol como sello.
 *  - La paginación activa pasó de dorado a tinta plena.
 */

const LIMITE = 10;

const CELDA_PAGINA =
  "flex h-11 min-w-[44px] items-center justify-center rounded text-menudo transition-colors";

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

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const roleFilter = (searchParams?.role as string) || "";
  const searchQuery = (searchParams?.q as string) || "";

  const supabase = await createClient();
  const { data: allUsers, error } = await supabase.rpc("get_admin_users");

  if (error) {
    return (
      <main className="mx-auto w-full max-w-tomo px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        <p role="alert" className="border border-laca/40 bg-laca-tenue p-4 text-laca">
          Error al cargar usuarios: {error.message}
        </p>
      </main>
    );
  }

  let filtrados = allUsers || [];
  if (roleFilter) {
    filtrados = filtrados.filter((u) => u.role === roleFilter);
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtrados = filtrados.filter(
      (u) =>
        u.email?.toLowerCase().includes(q) || u.id?.toLowerCase().includes(q),
    );
  }

  const count = filtrados.length;
  const totalPages = count ? Math.ceil(count / LIMITE) : 1;
  const from = (page - 1) * LIMITE;
  const to = from + LIMITE;
  const users = filtrados.slice(from, to);

  const admins = filtrados.filter((u) => u.role === "admin").length;

  const resumen = [
    { label: "Usuarios", valor: count },
    { label: "Administradores", valor: admins },
    { label: "Usuarios comunes", valor: count - admins },
  ];

  const buildPageHref = (p: number) => {
    const params = new URLSearchParams();
    params.set("page", String(p));
    if (roleFilter) params.set("role", roleFilter);
    if (searchQuery) params.set("q", searchQuery);
    return `/admin/usuarios?${params.toString()}`;
  };

  return (
    <main className="mx-auto w-full max-w-tomo px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-6 border-t border-rule pt-5 lg:flex-row lg:items-end">
        <div>
          <span className="indicador text-tinta">Administración · Usuarios</span>
          <h1 className="mt-3 font-display text-titulo font-normal text-tinta">
            Directorio de usuarios
          </h1>
          <p className="mt-3 max-w-[52ch] text-menudo text-tinta-tenue">
            Gestioná el acceso y los roles de quienes operan la plataforma.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <UserSearch />
          <Link
            href="/admin/usuarios/asignar-rol"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 border border-tinta bg-tinta px-5 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover"
          >
            <FiPlus aria-hidden="true" />
            Añadir usuario
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <UserTabs />
      </div>

      {/* Registro de totales */}
      <dl className="mt-10 grid grid-cols-1 border-t border-rule sm:grid-cols-3 sm:gap-x-0">
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
      <section className="mt-12" aria-label="Listado de usuarios">
        <div className="hidden grid-cols-12 gap-4 border-b border-tinta pb-3 pr-6 md:grid">
          <span className="col-span-5 indicador">Usuario</span>
          <span className="col-span-3 indicador">Rol</span>
          <span className="col-span-2 indicador">Identificador</span>
          <span className="col-span-2 indicador text-right">Acciones</span>
        </div>

        {users?.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-1 items-center gap-4 border-b border-rule py-5 pr-6 transition-colors hover:bg-hoja-alta md:grid-cols-12"
          >
            <div className="col-span-12 flex items-center gap-4 md:col-span-5">
              <span
                aria-hidden="true"
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-rule bg-hoja-alta font-display text-folio uppercase text-tinta"
              >
                {user.email?.charAt(0) || "U"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-folio font-normal text-tinta">
                  {user.email?.split("@")[0] || "Sin nombre"}
                </p>
                <p className="truncate text-menudo text-tinta-tenue">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="col-span-6 md:col-span-3">
              <span
                className={
                  user.role === "admin"
                    ? "sello sello--certificado"
                    : "sello sello--reservado"
                }
              >
                {user.role === "admin" ? "Administrador" : "Usuario"}
              </span>
            </div>

            <div className="col-span-6 md:col-span-2">
              <span className="indicador tabular">
                #{user.id.substring(0, 8).toUpperCase()}
              </span>
            </div>

            <div className="col-span-12 flex justify-end md:col-span-2">
              <ToggleRoleButton userId={user.id} currentRole={user.role} />
            </div>
          </div>
        ))}

        {(!users || users.length === 0) && (
          <div className="hoja mt-8 p-10 sm:p-14">
            <p className="font-display text-folio text-tinta">
              No encontramos usuarios con ese filtro.
            </p>
            <p className="mt-3 max-w-[46ch] text-menudo text-tinta-tenue">
              Probá con otro término de búsqueda o quitá el filtro de rol.
            </p>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <nav
            aria-label="Paginación de usuarios"
            className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row"
          >
            <p className="indicador tabular">
              Mostrando {from + 1}–{Math.min(to, count)} de {count}
            </p>
            <div className="flex items-center gap-1">
              <Link
                href={buildPageHref(Math.max(1, page - 1))}
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
                    href={buildPageHref(p as number)}
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
                href={buildPageHref(Math.min(totalPages, page + 1))}
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
