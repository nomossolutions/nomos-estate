'use client';

import { FiLogOut } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/*
 * LogoutButton — Sala Blanca.
 *
 * Lo que cambió: el fallback por defecto traía un estilo fuera del sistema
 * —texto blanco translúcido, radio grande, hover a bordó— que no se parecía a
 * nada del resto. Ahora es un control de borde, de la misma altura que el icono
 * de cuenta que tiene al lado, así los dos se leen como un par y no como dos
 * cosas sueltas.
 *
 * Se conserva el prop `className` para poder sobreescribirlo desde el panel, que
 * lo usa en su propio sidebar.
 */

interface LogoutButtonProps {
  className?: string;
}

const POR_DEFECTO =
  'inline-flex h-11 shrink-0 items-center gap-2 border border-rule px-4 text-menudo text-tinta-tenue transition-colors hover:border-tinta hover:text-tinta cursor-pointer';

export default function LogoutButton({ className }: LogoutButtonProps) {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sesión cerrada correctamente');
    router.push('/');
  };

  return (
    <button onClick={handleLogout} className={className || POR_DEFECTO}>
      <FiLogOut aria-hidden="true" />
      Cerrar sesión
    </button>
  );
}
