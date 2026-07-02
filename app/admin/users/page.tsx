import { FiSearch, FiPlus, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import ToggleRoleButton from '@/components/admin/ToggleRoleButton';

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = 10;

  const supabase = await createClient();
  const { data: allUsers, error } = await supabase.rpc('get_admin_users');

  const count = allUsers?.length || 0;
  const totalPages = count ? Math.ceil(count / limit) : 1;
  const from = (page - 1) * limit;
  const to = from + limit;
  const users = allUsers?.slice(from, to) || [];

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error al cargar usuarios: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic">
              Directorio de Usuarios
            </h1>
            <p className="text-nordic/60 mt-1 text-sm">
              Gestiona el acceso y roles de los usuarios de tus propiedades.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-nordic/40 group-focus-within:text-mosque text-xl" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white text-nordic shadow-soft placeholder-nordic/30 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-sm"
                placeholder="Buscar por nombre, email..."
                type="text"
              />
            </div>
            <button className="bg-mosque hover:bg-mosque/90 text-white px-5 py-2.5 min-h-[44px] rounded-lg text-sm font-medium shadow-md shadow-mosque/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <FiPlus className="text-base" />
              Añadir Usuario
            </button>
          </div>
        </div>
        <div className="mt-8 flex gap-6 border-b border-nordic/10 overflow-x-auto hide-scroll">
          <button className="whitespace-nowrap pb-3 text-sm font-semibold text-mosque border-b-2 border-mosque min-h-[44px]">
            Todos los Usuarios
          </button>
          <button className="whitespace-nowrap pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors min-h-[44px]">
            Agentes
          </button>
          <button className="whitespace-nowrap pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors min-h-[44px]">
            Corredores
          </button>
          <button className="whitespace-nowrap pb-3 text-sm font-medium text-nordic/60 hover:text-nordic transition-colors min-h-[44px]">
            Administradores
          </button>
        </div>
      </header>
      <main className="grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-4">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic/50 mb-2">
          <div className="col-span-4">Detalles del Usuario</div>
          <div className="col-span-3">Rol &amp; Estado</div>
          <div className="col-span-3">Rendimiento</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        {users?.map((user) => (
          <div
            key={user.id}
            className={`user-card group relative rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col md:grid md:grid-cols-12 gap-4 items-center transition-all ${user.role === 'admin' ? 'bg-hint-of-green hover:shadow-soft border-transparent' : 'bg-white hover:bg-hint-of-green/30'}`}
          >
            <div className="col-span-12 md:col-span-4 flex items-center w-full">
              <div className="relative shrink-0">
                <div className="h-12 w-12 rounded-full border-2 border-white bg-nordic/10 flex items-center justify-center text-nordic/60 font-bold uppercase">
                  {user.email?.charAt(0) || 'U'}
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              <div className="ml-4 overflow-hidden">
                <div className="text-sm font-bold text-nordic truncate">
                  {user.email?.split('@')[0] || 'Unknown User'}
                </div>
                <div className="text-xs text-nordic/70 truncate">
                  {user.email}
                </div>
                <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-gray-50/50 rounded text-nordic/60 group-hover:bg-white/50 transition-colors">
                  ID: #{user.id.substring(0, 8).toUpperCase()}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${user.role === 'admin' ? 'bg-mosque/10 text-mosque' : 'bg-gray-100 text-gray-600'}`}
              >
                {user.role === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
              <div className="flex items-center text-xs text-nordic/60">
                <FiCheckCircle className="text-sm mr-1 text-mosque" />
                Activo
              </div>
            </div>
            <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-nordic/50">
                  Propiedades
                </div>
                <div className="text-sm font-semibold text-nordic">-</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-nordic/50">
                  Nivel de Acceso
                </div>
                <div className="text-sm font-semibold text-nordic">
                  {user.role === 'admin' ? 'Nivel 5' : 'Nivel 1'}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
              <ToggleRoleButton userId={user.id} currentRole={user.role} />
            </div>
          </div>
        ))}

        {(!users || users.length === 0) && (
          <div className="text-center py-12 text-sm text-nordic/50">
            No se encontraron usuarios.
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-nordic/10 bg-gray-50/50 rounded-xl mt-6">
            <div className="text-sm text-nordic/60">
              Mostrando{' '}
              <span className="font-medium text-nordic">{from + 1}</span> -{' '}
              <span className="font-medium text-nordic">
                {Math.min(to, count)}
              </span>{' '}
              de <span className="font-medium text-nordic">{count}</span>{' '}
              resultados
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/users?page=${Math.max(1, page - 1)}`}
                className={`min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] flex items-center justify-center rounded-lg border border-nordic/10 bg-white text-nordic/60 hover:text-nordic hover:bg-gray-50 transition-colors ${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
              >
                <FiChevronLeft className="text-xl" />
              </Link>
              <div className="flex items-center gap-1">
                {(() => {
                  const getPages = (current: number, total: number) => {
                    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
                    const p: (number | string)[] = [1];
                    if (current > 3) p.push('...');
                    const start = Math.max(2, current - 1);
                    const end = Math.min(total - 1, current + 1);
                    for (let i = start; i <= end; i++) p.push(i);
                    if (current < total - 2) p.push('...');
                    p.push(total);
                    return p;
                  };
                  return getPages(page, totalPages).map((p, idx) =>
                    p === '...' ? (
                      <span key={`e-${idx}`} className="w-6 text-center text-nordic/40 text-sm select-none">...</span>
                    ) : (
                      <Link
                        key={p}
                        href={`/admin/users?page=${p}`}
                        className={`min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-mosque text-white' : 'text-nordic/60 hover:text-nordic hover:bg-gray-100'}`}
                      >
                        {p}
                      </Link>
                    ),
                  );
                })()}
              </div>
              <Link
                href={`/admin/users?page=${Math.min(totalPages, page + 1)}`}
                className={`min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] flex items-center justify-center rounded-lg border border-nordic/10 bg-white text-nordic/60 hover:text-nordic hover:bg-gray-50 transition-colors ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}
              >
                <FiChevronRight className="text-xl" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
