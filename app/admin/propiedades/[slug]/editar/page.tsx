import { FiChevronRight } from 'react-icons/fi';
import PropertyForm from '@/components/admin/PropertyForm';
import { createClient } from '@/lib/supabase/server';
import { getCategoriasActivas } from '@/lib/categories';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Property } from '@/types/property';

/*
 * Admin · Editar propiedad — Sala Blanca, modo Operate.
 * Mismo tratamiento que la página de creación, incluidas las categorías que
 * definió el admin. La consulta y el notFound quedan intactos.
 */

export default async function EditPropertyPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();
  const categorias = await getCategoriasActivas();

  /*
   * Se busca por slug y, si no aparece, por id.
   *
   * Por qué: el listado arma el enlace con `property.slug || property.id`, así que
   * el segmento de la URL puede ser cualquiera de las dos cosas. Buscar solo por
   * slug convertía esa mitad del fallback en un 404. Y como el formulario puede
   * regenerar el slug al guardar, un enlace viejo tampoco debería morir.
   */
  const { data: porSlug } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  const esUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      params.slug,
    );

  const property =
    porSlug ??
    (esUuid
      ? (
          await supabase
            .from('properties')
            .select('*')
            .eq('id', params.slug)
            .maybeSingle()
        ).data
      : null);

  if (!property) {
    notFound();
  }

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
              Editar
            </li>
          </ol>
        </nav>

        <h1 className="mt-4 font-display text-titulo font-normal text-tinta">
          Editar propiedad
        </h1>
        <p className="mt-3 max-w-[58ch] text-menudo text-tinta-tenue">
          {property.title} — los campos marcados con{" "}
          <span className="text-laca">*</span> son obligatorios.
        </p>
      </header>

      <div className="mt-12">
        <PropertyForm initialData={property as unknown as Property} categorias={categorias} />
      </div>
    </main>
  );
}
