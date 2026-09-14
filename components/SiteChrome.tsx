'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

/*
 * Chrome del sitio.
 *
 * El panel de administración tiene su propio shell (sidebar), así que en /admin
 * ni el navbar ni el footer públicos deben aparecer: eran la segunda navegación
 * que competía con el sidebar.
 *
 * Por qué esto es un componente cliente: la raíz del documento es un server
 * component y no conoce el pathname. La alternativa sería duplicar el layout
 * raíz con route groups, que multiplica la estructura para esconder dos
 * elementos. Acá el chrome y los children se renderizan en el mismo cliente, así
 * que no se pierde el HTML del servidor de las páginas.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '';
  const esPanel = pathname === '/admin' || pathname.startsWith('/admin/');

  if (esPanel) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div id="main-content">{children}</div>
      <Footer />
    </>
  );
}
