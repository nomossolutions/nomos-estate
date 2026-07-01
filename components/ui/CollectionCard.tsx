import { FiHeart, FiMapPin, FiHome, FiDroplet, FiMove } from 'react-icons/fi';
import Image from 'next/image';
import { Collection } from '@/data/mockData';
import Link from 'next/link';

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <Link
      href={`/properties/${collection.slug || collection.id}`}
      className="block group relative rounded-lg overflow-hidden shadow-soft bg-white cursor-pointer"
    >
      {/* Image Container */}
      <div className="aspect-4/3 w-full overflow-hidden relative">
        <Image
          src={collection.images?.[0] ?? '/placeholder.jpg'}
          alt={collection.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Tag */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic">
          {collection.tag}
        </div>

        {/* Favorite Button */}
        <button
          aria-label="Añadir a favoritos"
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-nordic hover:bg-mosque hover:text-white transition-all z-10 focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none"
        >
          <FiHeart className="text-xl" />
        </button>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-linear-to-t from-black/60 to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-medium text-nordic group-hover:text-mosque transition-colors font-display">
              {collection.title}
            </h3>
            <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
              <FiMapPin className="text-sm" />{' '}
              {collection.location}
            </p>
          </div>
          <span className="text-xl font-semibold text-mosque">
            ${collection.price.toLocaleString()}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic/5">
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <FiHome className="text-lg" />{' '}
            {collection.beds} Dorm.
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <FiDroplet className="text-lg" />{' '}
            {collection.baths} Baños
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <FiMove className="text-lg" />{' '}
            {collection.sqft.toLocaleString()} m²
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;
