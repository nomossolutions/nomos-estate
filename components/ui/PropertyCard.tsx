import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";

/*
 * PropertyCard — Sala Blanca.
 *
 * Lo que cambió respecto del mundo anterior: se fueron el número de serie y el
 * sello de venta/alquiler. La pieza ya no se presenta como un folio numerado,
 * así que lo que manda es la fotografía y después el precio. La jerarquía la
 * sostiene el aire, no el ornamento.
 *
 * Se conserva del rediseño anterior lo esencial: se define por reglas de 1px,
 * no proyecta sombra y no se levanta al pasar el mouse. Lo que responde es la
 * tinta, no la posición.
 *
 * La operación (venta/alquiler) sigue visible porque es un dato que el comprador
 * necesita para leer el precio; dejó de ser un sello y pasó a ser una etiqueta.
 */

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = memo(({ property }: PropertyCardProps) => {
  const esAlquiler = property.type === "rent";

  return (
    <Link
      href={`/properties/${property.slug || property.id}`}
      className="group flex h-full flex-col"
    >
      {/* Lámina: la fotografía manda, sin redondear y sin marco decorativo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-hoja-baja">
        <Image
          src={property.images?.[0] ?? "/placeholder.jpg"}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <h3 className="font-display text-folio font-normal leading-snug text-tinta transition-colors group-hover:text-laton">
          {property.title}
        </h3>
        <p className="mt-2 text-menudo text-tinta-tenue">{property.location}</p>

        <div className="mt-auto flex items-baseline justify-between gap-4 border-t border-rule pt-5">
          <span className="tabular font-display text-precio leading-none text-tinta">
            ${property.price.toLocaleString("es-CO")}
            {esAlquiler && (
              <span className="font-body text-menudo text-tinta-tenue">
                {" "}
                /mes
              </span>
            )}
          </span>
          <span className="indicador tabular">{property.sqft} m²</span>
        </div>
      </div>
    </Link>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
