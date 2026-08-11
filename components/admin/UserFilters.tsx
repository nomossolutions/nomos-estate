"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FiSearch } from "react-icons/fi";

const TABS = [
  { label: "Todos los Usuarios", value: "" },
  { label: "Agentes", value: "user" },
  { label: "Corredores", value: "user" },
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
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="relative group w-full md:w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="text-charcoal/40 group-focus-within:text-gold text-xl" />
      </div>
      <input
        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-charcoal shadow-soft placeholder:text-text-muted/30 focus:ring-2 focus:ring-gold focus:bg-white transition-all text-sm"
        placeholder="Buscar por nombre, email..."
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
    router.push(`/admin/users?${params.toString()}`);
  };

  const tabClass = (active: boolean) =>
    `whitespace-nowrap pb-3 text-sm transition-colors min-h-[44px] cursor-pointer border-b-2 ${
      active
        ? "font-semibold text-gold border-gold"
        : "font-medium text-charcoal/60 hover:text-charcoal border-transparent"
    }`;

  return (
    <div className="flex gap-6 border-b border-charcoal/10 overflow-x-auto hide-scroll">
      {TABS.map((tab) => (
        <button
          key={tab.label}
          onClick={() => handleRoleChange(tab.value)}
          className={tabClass(currentRole === tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
