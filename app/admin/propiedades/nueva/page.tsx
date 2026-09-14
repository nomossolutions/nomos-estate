import { FiChevronRight } from "react-icons/fi";
import PropertyForm from "@/components/admin/PropertyForm";
import { getCategoriasActivas } from "@/lib/categories";
import Link from "next/link";

/*
 * Admin · Nueva propiedad — Sala Blanca, modo Operate.
 * El breadcrumb es una línea de contexto y el titular usa la display del sistema.
 * La lógica del formulario no se toca.
 */

export default async function CreatePropertyPage() {
  /* Las categorías que definió el admin alimentan el campo del formulario. Si la
     migración no corrió, llega vacío y el campo no se muestra. */
  const categorias = await getCategoriasActivas();

  return (
    <main className="mx-auto w-full max-w-tomo px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <header className="border-t border-rule pt-5">
        <nav aria-label="Ruta de navegación">
          <ol className="flex items-center gap-2">
            <li className="indicador">
              <Link
                href="/admin/propiedades"
                className="text-tinta-tenue transition-colors hover:text-tinta"
              >
                Propiedades
              </Link>
            </li>
            <li aria-hidden="true">
              <FiChevronRight className="text-tinta-tenue" />
            </li>
            <li aria-current="page" className="indicador text-tinta">
              Nueva
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 font-display text-titulo font-normal text-tinta">
          Añadir nueva propiedad
        </h1>
        <p className="mt-3 max-w-[58ch] text-menudo text-tinta-tenue">
          Completá los detalles para crear el anuncio. Los campos marcados con{" "}
          <span className="text-laca">*</span> son obligatorios.
        </p>
      </header>

      <div className="mt-12">
        <PropertyForm categorias={categorias} />
      </div>
    </main>
  );
}
