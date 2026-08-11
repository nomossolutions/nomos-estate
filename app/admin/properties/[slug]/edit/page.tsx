import { FiChevronRight } from 'react-icons/fi';
import PropertyForm from '@/components/admin/PropertyForm';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Property } from '@/types/property';

export default async function EditPropertyPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !property) {
    notFound();
  }

  return (
    <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/50 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-text-muted font-medium font-body">
              <li>
                <Link
                  href="/admin/properties"
                  className="hover:text-gold transition-colors"
                >
                  Propiedades
                </Link>
              </li>
              <li>
                <FiChevronRight className="text-xs text-text-muted" />
              </li>
              <li aria-current="page" className="text-charcoal">
                Editar {property.title}
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight mb-2">
              Editar Propiedad
            </h1>
            <p className="text-base text-text-muted max-w-2xl font-normal font-body">
              Actualiza los detalles a continuación para modificar el anuncio existente. Los campos marcados con * son obligatorios.
            </p>
          </div>
        </div>
      </header>
      <PropertyForm initialData={property as unknown as Property} />
    </main>
  );
}
