"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import type { User } from "@supabase/supabase-js";
import LogoutButton from "./LogoutButton";
import content from "@/lib/i18n";

/*
 * Navbar del sitio público — Folio y Sello.
 *
 * Los links son SIEMPRE los del sitio (Inicio, Propiedades, Sobre Nosotros), con
 * sesión o sin ella. Antes, estar logueado como admin reemplazaba esta tabla por
 * los links de gestión (Inicio / Propiedades / Usuarios del panel), así que el
 * navbar del sitio público cambiaba de identidad según quién miraba.
 *
 * Ahora el acceso al panel vive donde corresponde: el icono de cuenta a la
 * derecha, que lleva a /admin. El panel tiene su propia navegación interna
 * (sidebar) y no necesita que el navbar público la duplique.
 *
 * Beneficio colateral: se fue la consulta a `user_roles` que este componente
 * hacía en cada página solo para decidir qué links pintar.
 */

interface NavLink {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const supabase = createClient();
  const dict = content.navbar;
  const [user, setUser] = useState<User | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = () => setIsMobileOpen(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  const links: NavLink[] = [
    { href: "/", label: dict.home, match: (p) => p === "/" },
    {
      href: "/#propiedades",
      label: dict.properties,
      match: (p) => p.startsWith("/properties"),
    },
    { href: "/about", label: dict.about, match: (p) => p === "/about" },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full pt-safe">
      <div className="border-b border-rule bg-hoja/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-tomo items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          {/* Wordmark: alineado al margen */}
          <Link href="/" className="group flex shrink-0 items-baseline gap-3">
            <span className="font-display text-marca font-normal tracking-[-0.015em] text-tinta">
              NOMOS
            </span>
          </Link>

          {/* Links del sitio: la misma tabla con sesión o sin ella */}
          <div className="hidden items-center gap-9 md:flex">
            {links.map((link) => {
              const active = link.match(pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative py-2 text-menudo transition-colors"
                >
                  <span
                    className={
                      active
                        ? "text-tinta"
                        : "text-tinta-tenue group-hover:text-tinta"
                    }
                  >
                    {link.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 ${
                      active ? "marca-linea--activa-doble" : ""
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden items-center gap-3 md:flex">
                {/* Puerta de entrada al panel: objetivo táctil de 44px */}
                <Link
                  href="/admin"
                  aria-label="Ir al panel de administración"
                  title="Panel de administración"
                  className="relative flex h-11 w-11 items-center justify-center overflow-hidden border border-rule transition-colors hover:border-tinta"
                >
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <FiUser className="text-tinta-tenue" />
                  )}
                </Link>
                {/* Cuenta y sesión: dos controles del mismo alto, un solo par */}
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden h-11 items-center border border-tinta bg-tinta px-5 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover md:inline-flex"
              >
                {dict.login}
              </Link>
            )}

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="flex h-11 w-11 items-center justify-center border border-rule text-tinta transition-colors hover:border-tinta md:hidden"
              aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`overflow-hidden border-b border-rule bg-hoja transition-[max-height] duration-300 md:hidden ${
          isMobileOpen ? "max-h-[32rem]" : "max-h-0"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div className="space-y-0 px-4 py-2 sm:px-6">
          {links.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobile}
                aria-current={active ? "page" : undefined}
                className="flex items-center justify-between border-b border-rule/60 py-4 text-cuerpo text-tinta last:border-b-0"
              >
                {link.label}
                {active && (
                  <span aria-hidden="true" className="marca-linea--activa w-8" />
                )}
              </Link>
            );
          })}

          <div className="py-4">
            {user ? (
              <div className="flex items-center justify-between gap-3">
                <Link
                  href="/admin"
                  onClick={closeMobile}
                  className="flex items-center gap-3 text-cuerpo text-tinta"
                >
                  <span className="flex h-11 w-11 items-center justify-center overflow-hidden border border-rule">
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt=""
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    ) : (
                      <FiUser className="text-tinta-tenue" />
                    )}
                  </span>
                  Ir al panel
                </Link>
                <LogoutButton className="text-menudo text-tinta-tenue" />
              </div>
            ) : (
              <Link
                href="/login"
                onClick={closeMobile}
                className="flex h-12 w-full items-center justify-center border border-tinta bg-tinta text-menudo font-medium text-hoja"
              >
                {dict.login}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
