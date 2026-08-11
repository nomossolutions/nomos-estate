import { FiChevronRight } from "react-icons/fi";
import PropertyForm from "@/components/admin/PropertyForm";
import Link from "next/link";

export default function CreatePropertyPage() {
  return (
    <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
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
                Añadir Nueva
              </li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal tracking-tight mb-2">
              Añadir Nueva Propiedad
            </h1>
            <p className="text-base text-text-muted max-w-2xl font-normal font-body">
              Completa los detalles a continuación para crear un nuevo anuncio.
              Los campos marcados con * son obligatorios.
            </p>
          </div>
        </div>
      </header>

      <PropertyForm />
    </main>
  );
}
