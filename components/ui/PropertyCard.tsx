import { memo } from "react";
import { FiHeart, FiHome, FiDroplet, FiMove } from "react-icons/fi";
import Image from "next/image";
import { Property } from "@/types/property";
import Link from "next/link";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = memo(({ property }: PropertyCardProps) => {
  return (
    <Link
      href={`/properties/${property.slug || property.id}`}
      className="group flex flex-col bg-surface-container-lowest overflow-hidden border border-outline-variant/30 hover:shadow-elevated hover:-translate-y-1 transition-all duration-500 h-full"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={property.images?.[0] ?? "/placeholder.jpg"}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Type Tag */}
        <span className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-sm text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
          {property.type === "sale" ? "Venta" : "Alquiler"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-display text-xl font-medium mb-2 text-primary">
          {property.title}
        </h3>
        <p className="text-secondary text-sm mb-4">{property.location}</p>

        <div className="mt-auto flex justify-between items-center border-t border-outline-variant/30 pt-4">
          <span className="font-display text-lg text-primary tracking-tight">
            ${property.price.toLocaleString("es-CO")}
            {property.type === "rent" && (
              <span className="text-sm font-normal text-secondary">/mes</span>
            )}
          </span>
          <span className="text-[10px] text-tertiary-fixed-dim tracking-widest uppercase">
            {property.sqft} m²
          </span>
        </div>
      </div>
    </Link>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
