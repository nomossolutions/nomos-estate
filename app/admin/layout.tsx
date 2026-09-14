import { type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';

/*
 * Shell del panel de administración — Folio y Sello, modo Operate.
 *
 * Este layout es ahora el único responsable de la navegación y del offset del
 * sidebar. Las páginas hijas ya no manejan su propio `pt-28` ni el ancho de
 * contenedor: el shell lo resuelve una sola vez.
 *
 * CORRECCIÓN QUE SE MANTIENE: el contenedor usa la fuente de texto, nunca la
 * display. Aplicar `font-display` a todo el panel pondría Jost en cuerpos de
 * dato, donde la display no corresponde.
 */

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-hoja font-body text-tinta antialiased">
      <AdminSidebar email={user?.email ?? ''} />

      {/* En móvil la barra superior ocupa 64px; en desktop manda el sidebar */}
      <div className="pt-16 lg:pl-[264px] lg:pt-0">
        <div id="main-content">{children}</div>
      </div>
    </div>
  );
}
