'use client';

import { FiLogOut } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sesión cerrada correctamente');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-white/70 hover:text-red-400 transition-colors ml-4 flex items-center justify-center p-1 rounded-md hover:bg-white/10"
      title="Cerrar sesión"
    >
      <FiLogOut className="text-xl" />
    </button>
  );
}
