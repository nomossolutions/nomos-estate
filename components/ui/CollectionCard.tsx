import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/types/collection";

/*
 * CollectionCard — Sala Blanca.
 *
 * Lo que cambió respecto del mundo anterior: se fueron la numeración de lámina y
 * el sello, y el tag único dejó de mezclar dos conceptos distintos.
 *
 * "Nuevo" y "Exclusivo" ahora se leen por separado porque son hechos distintos:
 * uno es temporal (cuándo entró al catálogo) y el otro es una decisión de
 * curaduría. Mezclados en un solo tag, una propiedad recién cargada y destacada
 * no podía decir las dos cosas, y una vieja no destacada decía "Exclusivo" sin
 * serlo. Pueden aparecer juntos.
 *
 * Son etiquetas tipográficas, no sellos: sin caja, sin borde, solo tono.
 */

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  const etiquetas = [
    collection.isFeatured && { texto: "Exclusivo", tenue: false },
    collection.isNew && { texto: "Nuevo", tenue: true },
  ].filter(Boolean) as { texto: string; tenue: boolean }[];

  return (
    <Link
      href={`/properties/${collection.slug || collection.id}`}
      className="group block"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-hoja-baja">
        <Image
          src={collection.images?.[0] ?? "/placeholder.jpg"}
          alt={collection.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-6 border-t border-rule pt-5">
        {etiquetas.length > 0 && (
          <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
            {etiquetas.map((e) => (
              <span
                key={e.texto}
                className={`indicador ${e.tenue ? "" : "text-laton"}`}
              >
                {e.texto}
              </span>
            ))}
          </p>
        )}

        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="min-w-0">
            <h3 className="max-w-[24ch] font-display text-lamina font-normal leading-tight text-tinta transition-colors group-hover:text-laton">
              {collection.title}
            </h3>
            <p className="mt-2 text-menudo text-tinta-tenue">
              {collection.location}
            </p>
          </div>
          <span className="tabular font-display text-precio leading-none text-tinta">
            ${collection.price.toLocaleString("es-CO")}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;
