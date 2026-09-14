'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import {
  FiGrid,
  FiHome,
  FiTag,
  FiLogOut,
  FiUsers,
  FiX,
  FiMenu,
  FiExternalLink,
} from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

/*
 * Shell del panel de administración — Folio y Sello, modo Operate.
 *
 * Por qué un sidebar y no el navbar global: el navbar público ofrecía la misma
 * navegación que el panel, así que en /admin había dos juegos de navegación
 * compitiendo y ninguno decía dónde estabas. Acá el sidebar es la única
 * navegación del panel, con la sección marcada por la marca de línea del mundo
 * (forma, no color).
 *
 * El componente vive en el thread del layout, no en la librería de UI, porque es
 * específico de este panel.
 */

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
}

const SECCIONES = [
  { etiqueta: 'Gestión', items: ['panel', 'propiedades', 'categorias', 'usuarios'] },
  { etiqueta: 'Cuenta', items: ['sitio', 'salir'] },
];

const ITEMS: Record<string, NavItem> = {
  panel: { href: '/admin', label: 'Panel', icon: <FiGrid />, exact: true },
  propiedades: {
    href: '/admin/propiedades',
    label: 'Propiedades',
    icon: <FiHome />,
  },
  categorias: {
    href: '/admin/categorias',
    label: 'Categorías',
    icon: <FiTag />,
  },
  usuarios: { href: '/admin/usuarios', label: 'Usuarios', icon: <FiUsers /> },
  sitio: { href: '/', label: 'Ver sitio público', icon: <FiExternalLink /> },
  salir: { href: '#salir', label: 'Cerrar sesión', icon: <FiLogOut /> },
};

/**
 * Marca de registro: la geometría del mundo, dibujada. Es SVG haciendo lo que el
 * SVG hace bien (formas exactas), no un sello decorativo.
 */
function MarcaRegistro() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 text-tinta-tenue"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <circle cx="12" cy="12" r="6" />
      <path d="M12 0v24M0 12h24" />
    </svg>
  );
}

function esActiva(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [abierto, setAbierto] = useState(false);
  const [saliendo, setSaliendo] = useState(false);

  // Bloquear el scroll del body con el drawer abierto
  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previo;
    };
  }, [abierto]);

  const cerrarSesion = async () => {
    setSaliendo(true);
    try {
      await supabase.auth.signOut();
      toast.success('Sesión cerrada correctamente');
      router.push('/');
    } catch {
      toast.error('No se pudo cerrar la sesión');
      setSaliendo(false);
    }
  };

  const inicial = email.charAt(0).toUpperCase() || 'U';

  const contenido = (
    <div className="flex h-full flex-col border-r border-rule bg-hoja-alta">
      {/* Wordmark */}
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-rule px-6">
        <MarcaRegistro />
        <Link
          href="/admin"
          className="font-display text-marca tracking-[-0.015em] text-tinta"
        >
          NOMOS
        </Link>
        <span className="indicador ml-auto">Panel</span>
      </div>

      {/* Navegación */}
      <nav aria-label="Navegación del panel" className="flex-1 overflow-y-auto px-3 py-6">
        {SECCIONES.map((seccion) => (
          <div key={seccion.etiqueta} className="mb-8 last:mb-0">
            <p className="indicador px-3 pb-3">{seccion.etiqueta}</p>
            <ul className="space-y-1">
              {seccion.items.map((clave) => {
                const item = ITEMS[clave];

                if (clave === 'salir') {
                  return (
                    <li key={clave}>
                      <button
                        type="button"
                        onClick={() => {
                          setAbierto(false);
                          cerrarSesion();
                        }}
                        disabled={saliendo}
                        className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-menudo text-tinta-tenue transition-colors hover:bg-hoja-baja hover:text-tinta disabled:opacity-50"
                      >
                        <span aria-hidden="true" className="shrink-0">
                          {item.icon}
                        </span>
                        {saliendo ? 'Cerrando…' : item.label}
                      </button>
                    </li>
                  );
                }

                const activa = esActiva(pathname, item);
                return (
                  <li key={clave}>
                    <Link
                      href={item.href}
                      onClick={() => setAbierto(false)}
                      aria-current={activa ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded px-3 py-2.5 text-menudo transition-colors ${
                        activa
                          ? 'bg-tinta text-hoja'
                          : 'text-tinta-tenue hover:bg-hoja-baja hover:text-tinta'
                      }`}
                    >
                      <span aria-hidden="true" className="shrink-0">
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Cuenta */}
      <div className="shrink-0 border-t border-rule p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center border border-rule bg-hoja font-display text-folio uppercase text-tinta"
          >
            {inicial}
          </span>
          <div className="min-w-0">
            <p className="indicador">Administrador</p>
            <p className="truncate text-menudo text-tinta" title={email}>
              {email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Barra móvil: la navegación se colapsa a un drawer */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center gap-3 border-b border-rule bg-hoja px-4 pt-safe lg:hidden">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir navegación del panel"
          aria-expanded={abierto}
          className="flex h-11 w-11 items-center justify-center border border-rule-fuerte text-tinta"
        >
          <FiMenu />
        </button>
        <span className="font-display text-marca tracking-[-0.015em] text-tinta">
          NOMOS
        </span>
        <span className="indicador ml-auto">Panel</span>
      </header>

      {/* Sidebar fijo en desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] lg:block">
        {contenido}
      </aside>

      {/* Drawer en móvil */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          abierto ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        aria-hidden={!abierto}
      >
        <div
          className={`absolute inset-0 bg-tinta/50 transition-opacity duration-200 ${
            abierto ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setAbierto(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-hoja-alta transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            abierto ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar navegación"
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center border border-rule-fuerte bg-hoja text-tinta"
          >
            <FiX />
          </button>
          {contenido}
        </div>
      </div>
    </>
  );
}
