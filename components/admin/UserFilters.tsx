"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

/*
 * UserFilters — Folio y Sello.
 *
 * BUG CORREGIDO: los tabs eran cuatro, pero "Agentes" y "Corredores" tenían
 * ambos `value: "user"`, así que filtraban exactamente lo mismo y la interfaz
 * ofrecía dos opciones distintas que hacían una sola cosa. Peor: el modelo de
 * datos solo tiene dos roles —`'admin' | 'user'` (confirmado en
 * app/admin/usuarios/actions.ts)— así que "Agente" y "Corredor" no existen.
 *
 * Ahora los tabs dicen lo que el sistema realmente puede distinguir. Si en el
 * futuro se agrega un rol `agent`, esto se amplía.
 */

const TABS = [
  { label: "Todos", value: "" },
  { label: "Usuarios", value: "user" },
  { label: "Administradores", value: "admin" },
] as const;

export function UserSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("q") || "";

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/admin/usuarios?${params.toString()}`);
  };

  return (
    <div className="relative w-full md:w-80">
      <FiSearch
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-tenue"
      />
      <input
        className="h-11 w-full border border-rule-fuerte bg-hoja-alta pl-10 pr-3 text-menudo text-tinta placeholder:text-tinta-tenue/70 transition-colors focus:border-tinta focus:outline-none"
        placeholder="Buscar por nombre o email…"
        type="text"
        aria-label="Buscar usuarios"
        defaultValue={currentSearch}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
}

export function UserTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRole = searchParams.get("role") || "";

  const handleRoleChange = (role: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (role) {
      params.set("role", role);
    } else {
      params.delete("role");
    }
    params.delete("page");
    router.push(`/admin/usuarios?${params.toString()}`);
  };

  return (
    <div
      role="group"
      aria-label="Filtrar por rol"
      className="hide-scroll flex gap-8 overflow-x-auto border-b border-rule pb-4"
    >
      {TABS.map((tab) => {
        const activa = currentRole === tab.value;
        return (
          <button
            key={tab.label}
            onClick={() => handleRoleChange(tab.value)}
            aria-pressed={activa}
            className="group flex min-w-20 flex-col items-start gap-2"
          >
            <span
              className={`text-menudo transition-colors ${
                activa ? "text-tinta" : "text-tinta-tenue group-hover:text-tinta"
              }`}
            >
              {tab.label}
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
  );
}
