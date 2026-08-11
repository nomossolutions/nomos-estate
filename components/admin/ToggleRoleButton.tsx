'use client';

import { FiRefreshCw } from 'react-icons/fi';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { toggleUserRole } from '@/app/admin/users/actions';
import { useRouter } from 'next/navigation';

function SubmitButton({ isAdmin }: { isAdmin: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center px-4 py-2 border border-charcoal/10 bg-white shadow-sm text-xs font-medium rounded-lg text-charcoal hover:bg-charcoal hover:text-white focus:outline-none transition-colors w-full md:w-auto justify-center disabled:opacity-50 cursor-pointer"
    >
      {isAdmin ? 'Quitar Admin' : 'Hacer Admin'}
      <FiRefreshCw className={`text-base ml-2 ${pending ? 'animate-spin' : ''}`} />
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
