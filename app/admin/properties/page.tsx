'use server';

import {
  FiPlus, FiHome, FiCheckCircle, FiEyeOff, FiEye,
  FiEdit, FiChevronLeft, FiChevronRight, FiDroplet
} from 'react-icons/fi';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function togglePropertyStatus(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  const currentStatus = formData.get('is_active') === 'true';
  const supabase = await createClient();
  await supabase
    .from('properties')
    .update({ is_active: !currentStatus })
    .eq('id', id);
  revalidatePath('/admin/properties');
}

export default async function AdminPropertiesPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const limit = 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  // Admin sees ALL properties (active + inactive)
  const { count } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  const totalPages = count ? Math.ceil(count / limit) : 1;

  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return <div className="p-8 text-red-500">Error al cargar propiedades</div>;
  }

  const activeCount = properties?.filter((p) => p.is_active).length || 0;
  const totalListings = count || 0;
  const inactiveCount = properties?.filter((p) => !p.is_active).length || 0;

  return (
    <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-nordic tracking-tight">
            Mis Propiedades
          </h1>
          <p className="text-nordic/60 mt-1 text-sm">
            Gestiona tu portafolio y sigue el rendimiento.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties/create"
            className="bg-mosque hover:bg-mosque/90 text-white px-5 py-2.5 min-h-[44px] rounded-lg text-sm font-medium shadow-md shadow-mosque/20 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
          >
            <FiPlus className="text-base" /> Añadir
            Propiedad
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-nordic/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nordic/60">Total Propiedades</p>
            <p className="text-2xl font-bold text-nordic mt-1">
              {totalListings}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-mosque/10 flex items-center justify-center text-mosque">
            <FiHome className="text-xl" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-nordic/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nordic/60">
              Activas
            </p>
            <p className="text-2xl font-bold text-nordic mt-1">{activeCount}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-hint-of-green flex items-center justify-center text-mosque">
            <FiCheckCircle className="text-xl" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-nordic/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-nordic/60">
              Inactivas
            </p>
            <p className="text-2xl font-bold text-nordic mt-1">
              {inactiveCount}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
            <FiEyeOff className="text-xl" />
          </div>
        </div>
      </div>

      {/* Property List Container */}
      <div className="bg-white rounded-xl shadow-sm border border-nordic/10 overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50/50 border-b border-nordic/10 text-xs font-semibold text-nordic/60 uppercase tracking-wider">
          <div className="col-span-6">Detalles</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        {properties?.map((property) => (
          <div
            key={property.id}
            className={`group grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 border-b border-nordic/10 hover:bg-clear-day transition-colors items-center ${
              !property.is_active ? 'opacity-60' : ''
            }`}
          >
            {/* Property Details */}
            <div className="col-span-12 md:col-span-6 flex gap-4 items-center">
              <div className="relative h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt={property.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={
                    property.images?.[0] ||
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400'
                  }
                />
                {!property.is_active && (
                  <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                    <FiEyeOff className="text-white text-2xl" />
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <Link href={`/properties/${property.slug}`}>
                  <h3 className="text-lg font-bold text-nordic group-hover:text-mosque transition-colors cursor-pointer truncate">
                    {property.title}
                  </h3>
                </Link>
                <p className="text-sm text-nordic/60 truncate">
                  {property.location}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-nordic/50">
                  <span className="flex items-center gap-1">
                    <FiHome className="text-sm" />{' '}
                    {property.beds || 0} Dorm.
                  </span>
                  <span className="w-1 h-1 rounded-full bg-nordic/20"></span>
                  <span className="flex items-center gap-1">
                    <FiDroplet className="text-sm" />{' '}
                    {property.baths || 0} Baños
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-6 md:col-span-2">
              <div className="text-base font-semibold text-nordic">
                ${property.price.toLocaleString()}
              </div>
              <div className="text-xs text-nordic/50 capitalize">
                {property.type}
              </div>
            </div>

            {/* Status */}
            <div className="col-span-6 md:col-span-2 flex flex-col gap-1.5">
              {property.is_active ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                  Activa
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                  Inactiva
                </span>
              )}
              {property.is_featured && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-hint-of-green text-mosque border border-mosque/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-mosque mr-1.5"></span>
                  Destacada
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="col-span-12 md:col-span-2 flex items-center justify-end gap-2">
              <Link
                href={`/admin/properties/${property.slug}/edit`}
                className="min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] flex items-center justify-center p-2 rounded-lg text-nordic/40 hover:text-mosque hover:bg-hint-of-green/50 transition-all"
                title="Editar Propiedad"
              >
                <FiEdit className="text-xl" />
              </Link>

              {/* Deactivate / Activate toggle */}
              <form action={togglePropertyStatus}>
                <input type="hidden" name="id" value={property.id} />
                <input
                  type="hidden"
                  name="is_active"
                  value={String(property.is_active)}
                />
                <button
                  type="submit"
                  title={
                    property.is_active
                      ? 'Desactivar Propiedad'
                      : 'Activar Propiedad'
                  }
                  className={`min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] flex items-center justify-center p-2 rounded-lg transition-all ${
                    property.is_active
                      ? 'text-nordic/40 hover:text-red-600 hover:bg-red-50'
                      : 'text-nordic/40 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {property.is_active ? <FiEyeOff className="text-xl" /> : <FiEye className="text-xl" />}
                </button>
              </form>
            </div>
          </div>
        ))}

        {(!properties || properties.length === 0) && (
          <div className="text-center py-12 text-sm text-nordic/50">
            No se encontraron propiedades.
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-nordic/10 bg-gray-50/50">
            <div className="text-sm text-nordic/60">
              Mostrando{' '}
              <span className="font-medium text-nordic">{from + 1}</span> -{' '}
              <span className="font-medium text-nordic">
                {Math.min(to + 1, totalListings)}
              </span>{' '}
              de{' '}
              <span className="font-medium text-nordic">{totalListings}</span>{' '}
              resultados
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/properties?page=${Math.max(1, page - 1)}`}
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
                        href={`/admin/properties?page=${p}`}
                        className={`min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-mosque text-white' : 'text-nordic/60 hover:text-nordic hover:bg-gray-100'}`}
                      >
                        {p}
                      </Link>
                    ),
                  );
                })()}
              </div>
              <Link
                href={`/admin/properties?page=${Math.min(totalPages, page + 1)}`}
                className={`min-w-[44px] min-h-[44px] md:min-w-[36px] md:min-h-[36px] flex items-center justify-center rounded-lg border border-nordic/10 bg-white text-nordic/60 hover:text-nordic hover:bg-gray-50 transition-colors ${page === totalPages ? 'pointer-events-none opacity-50' : ''}`}
              >
                <FiChevronRight className="text-xl" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
