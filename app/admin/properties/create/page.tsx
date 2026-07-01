import { FiChevronRight } from 'react-icons/fi';
import PropertyForm from '@/components/admin/PropertyForm';
import Link from 'next/link';

export default function CreatePropertyPage() {
  return (
    <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sans">
              <li>
                <Link
                  href="/admin/properties"
                  className="hover:text-mosque transition-colors"
                >
                  Propiedades
                </Link>
              </li>
              <li>
                <FiChevronRight className="text-xs text-gray-400" />
              </li>
              <li aria-current="page" className="text-nordic">
                Añadir Nueva
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">
              Añadir Nueva Propiedad
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sans">
              Completa los detalles a continuación para crear un nuevo anuncio. Los campos marcados con * son obligatorios.
            </p>
          </div>
        </div>
      </header>

      <PropertyForm />
    </main>
  );
}
