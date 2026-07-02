'use client';

import { FiLogOut } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
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
      className={className || "text-white/70 hover:text-red-400 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"}
    >
      <FiLogOut className="text-lg" />
      Cerrar Sesión
    </button>
  );
}
