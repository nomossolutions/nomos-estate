import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { Collection } from "@/types/collection";
import CollectionCard from "./ui/CollectionCard";
import { SectionHeading } from "./ui/primitives";
import { createClient } from "@/lib/supabase/server";
import content from "@/lib/i18n";

/*
 * FeaturedCollection — Sala Blanca.
 *
 * Las propiedades destacadas que el equipo marcó con `is_featured`.
 *
 * Sobre "Nuevo": se DERIVA de `created_at`, no de una columna. El sistema ya
 * tiene el dato real de cuándo entró la propiedad, así que un flag aparte solo
 * podía desincronizarse — y de hecho lo estaba: la columna `is_new` existe en la
 * base pero ningún formulario la escribe, así que siempre valía `false` y la
 * etiqueta "Nuevo" era inalcanzable.
 *
 * El umbral vive en una constante con nombre para que sea una decisión y no un
 * número suelto. Es de producto: cambialo si la rotación del catálogo lo pide.
 */

/** Días durante los cuales una propiedad cuenta como recién ingresada. */
const DIAS_NUEVO = 30;

function esNueva(createdAt: string | null): boolean {
  if (!createdAt) return false;
  const creada = new Date(createdAt).getTime();
  if (Number.isNaN(creada)) return false;
  const dias = (Date.now() - creada) / 86_400_000;
  return dias <= DIAS_NUEVO;
}

const FeaturedCollection = async () => {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(2);

  const collections: Collection[] = (properties || []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug || undefined,
    location: p.location,
    price: p.price,
    images: p.images || [],
    beds: p.beds,
    baths: p.baths,
    sqft: p.sqft,
    isFeatured: Boolean(p.is_featured),
    isNew: esNueva(p.created_at),
  }));

  if (collections.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <SectionHeading
        title={content.common.featured_properties}
        measure="Propiedades seleccionadas por el estudio para los más exigentes."
        action={
          <Link
            href="/#propiedades"
            className="group hidden items-center gap-2 border-b border-transparent pb-1 text-menudo font-medium text-tinta transition-colors hover:border-tinta sm:inline-flex"
          >
            Ver todas
            <FiArrowRight
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        }
      />

      <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 lg:grid-cols-2">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollection;
