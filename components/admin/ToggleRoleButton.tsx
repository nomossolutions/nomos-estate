'use client';

import { FiRefreshCw } from 'react-icons/fi';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { toggleUserRole } from '@/app/admin/usuarios/actions';
import { useRouter } from 'next/navigation';

/*
 * ToggleRoleButton — Folio y Sello.
 * Lo que cambió: se fue el botón blanco con `shadow-sm` y radio grande. Ahora es
 * un botón de regla, y el estado de peligro (quitar el admin) usa el lacre, que
 * es el único con permiso semántico para marcar algo destructivo.
 */

function SubmitButton({ isAdmin }: { isAdmin: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-11 w-full items-center justify-center border px-4 text-menudo font-medium transition-colors disabled:opacity-50 md:w-auto ${
        isAdmin
          ? 'border-laca/40 text-laca hover:border-laca hover:bg-laca/10'
          : 'border-rule-fuerte text-tinta hover:border-tinta'
      }`}
    >
      {isAdmin ? 'Quitar admin' : 'Hacer admin'}
      <FiRefreshCw
        aria-hidden="true"
        className={`ml-2 ${pending ? 'animate-spin' : ''}`}
      />
    </button>
  );
}

export default function ToggleRoleButton({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const router = useRouter();

  return (
    <form
      action={async () => {
        try {
          await toggleUserRole(userId, currentRole);
          const newRole = currentRole === 'admin' ? 'user' : 'admin';
          toast.success(
            newRole === 'admin'
              ? 'Usuario promovido a administrador'
              : 'Usuario degradado a rol normal',
          );
          router.refresh();
        } catch {
          toast.error('Error al cambiar el rol del usuario');
        }
      }}
      className="w-full md:w-auto"
    >
      <SubmitButton isAdmin={currentRole === 'admin'} />
    </form>
  );
}
