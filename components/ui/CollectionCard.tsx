import { FiMapPin } from "react-icons/fi";
import Image from "next/image";
import { Collection } from "@/data/mockData";
import Link from "next/link";

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <Link
      href={`/properties/${collection.slug || collection.id}`}
      className="group cursor-pointer  "
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] mb-6">
        <Image
          src={collection.images?.[0] ?? "/placeholder.jpg"}
          alt={collection.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <span className="text-xs text-tertiary-fixed-dim tracking-widest uppercase mb-2 block font-semibold">
            {collection.tag}
          </span>
          <h3 className="font-display text-2xl text-primary mb-2 truncate">
            {collection.title}
          </h3>
          <p className="text-secondary flex items-center gap-1">
            <FiMapPin className="text-sm shrink-0" />
            <span className="truncate">{collection.location}</span>
          </p>
        </div>
        <span className="font-display text-xl text-primary shrink-0">
          ${collection.price.toLocaleString("es-CO")}
        </span>
      </div>
    </Link>
  );
};

export default CollectionCard;
