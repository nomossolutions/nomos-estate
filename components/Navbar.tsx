"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FiHome, FiUser, FiMenu, FiX } from "react-icons/fi";
import type { User } from "@supabase/supabase-js";
import LogoutButton from "./LogoutButton";
import content from "@/lib/i18n";

export default function Navbar() {
  const pathname = usePathname();
  const supabase = createClient();
  const dict = content.navbar;
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const closeMobile = () => setIsMobileOpen(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();
        setIsAdmin(roleData?.role === "admin");
      }
    };
    getUser();
  }, [supabase]);

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") return true;
    if (
      href === "/admin/properties" &&
      pathname.startsWith("/admin/properties")
    )
      return true;
    if (href === "/admin/users" && pathname.startsWith("/admin/users"))
      return true;
    if (href === "/" && pathname === "/") return true;
    if (href === "/about" && pathname === "/about") return true;
    return false;
  };

  const linkClass = (href: string) => {
    return isActive(href)
      ? "text-charcoal font-semibold border-b-2 border-charcoal"
      : "text-text-secondary hover:text-charcoal font-medium border-b-2 border-transparent hover:border-charcoal/20";
  };

  const mobileLinkClass = (href: string) => {
    return isActive(href)
      ? "block px-3 py-2 rounded-md text-base font-medium text-charcoal bg-charcoal/5"
      : "block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-charcoal/5";
  };

  const isAuthenticated = !!user;

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-500 ease-in-out pt-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span className="text-xl font-bold tracking-tighter text-charcoal font-display">
              NOMOS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAdmin ? (
              <>
                <Link
                  href="/"
                  className={`px-1 py-1 text-sm transition-all tracking-widest uppercase ${linkClass("/")}`}
                >
                  Inicio
                </Link>
                <Link
                  href="/admin/properties"
                  className={`px-1 py-1 text-sm transition-all tracking-widest uppercase ${linkClass("/admin/properties")}`}
                >
                  Propiedades
                </Link>
                <Link
                  href="/admin/users"
                  className={`px-1 py-1 text-sm transition-all tracking-widest uppercase ${linkClass("/admin/users")}`}
                >
                  Usuarios
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/#hero"
                  className="text-text-secondary hover:text-charcoal font-medium text-sm tracking-widest uppercase hover:border-b-2 hover:border-charcoal/20 px-1 py-1 transition-all"
                >
                  {dict.home}
                </Link>
                <Link
                  href="/#properties"
                  className="text-text-secondary hover:text-charcoal font-medium text-sm tracking-widest uppercase hover:border-b-2 hover:border-charcoal/20 px-1 py-1 transition-all"
                >
                  {dict.properties}
                </Link>
                <Link
                  href="/about"
                  className={`px-1 py-1 text-sm transition-all tracking-widest uppercase ${linkClass("/about")}`}
                >
                  {dict.about}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg text-charcoal hover:bg-charcoal/5 transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none cursor-pointer"
              aria-label={isMobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          </div>

          {/* Actions - Desktop only */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full ring-2 ring-transparent hover:ring-gold transition-all relative flex items-center justify-center overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                        <FiUser className="text-text-muted text-lg" />
                      </div>
                    )}
                  </div>
                </Link>
                <LogoutButton className="text-text-secondary hover:text-burgundy transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-charcoal/5 text-sm font-medium" />
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-charcoal hover:bg-charcoal-hover text-on-primary text-sm font-semibold px-6 py-3 rounded transition-all"
                >
                  {dict.login}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-charcoal/10 bg-surface/95 backdrop-blur-xl overflow-hidden transition-all duration-300 ${isMobileOpen ? "max-h-96" : "max-h-0"}`}
        role="navigation"
        aria-label="Menú de navegación móvil"
        aria-hidden={!isMobileOpen}
      >
        <div className="px-4 py-2 space-y-1">
          {isAdmin ? (
            <>
              <Link
                href="/"
                onClick={closeMobile}
                className={mobileLinkClass("/")}
              >
                Inicio
              </Link>
              <Link
                href="/admin/properties"
                onClick={closeMobile}
                className={mobileLinkClass("/admin/properties")}
              >
                Propiedades
              </Link>
              <Link
                href="/admin/users"
                onClick={closeMobile}
                className={mobileLinkClass("/admin/users")}
              >
                Usuarios
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/#hero"
                onClick={closeMobile}
                className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-charcoal/5"
              >
                {dict.home}
              </Link>
              <Link
                href="/#properties"
                onClick={closeMobile}
                className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-charcoal/5"
              >
                {dict.properties}
              </Link>
              <Link
                href="/about"
                onClick={closeMobile}
                className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-charcoal/5"
              >
                {dict.about}
              </Link>
            </>
          )}
          {/* Divider */}
          <div className="border-t border-charcoal/10 my-2"></div>
          {/* Mobile auth */}
          {isAuthenticated ? (
            <div className="space-y-1">
              <Link
                href="/admin"
                onClick={closeMobile}
                className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-charcoal/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shrink-0">
                    {user?.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    ) : (
                      <FiUser className="text-text-muted text-sm" />
                    )}
                  </div>
                  <span>Mi Perfil</span>
                </div>
              </Link>
              <LogoutButton className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-charcoal/5" />
            </div>
          ) : (
            <div className="px-3 py-2">
              <Link
                href="/login"
                onClick={closeMobile}
                className="block w-full text-center bg-charcoal hover:bg-charcoal-hover text-white text-sm font-semibold px-5 py-3 rounded-lg transition-all"
              >
                {dict.login}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
