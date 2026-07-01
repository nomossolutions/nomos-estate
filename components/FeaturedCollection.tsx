import { FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { Collection } from '@/data/mockData';
import CollectionCard from './ui/CollectionCard';
import { createClient } from '@/lib/supabase/server';
import content from '@/lib/i18n';

const FeaturedCollection = async () => {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
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
    tag: p.is_new ? 'Nuevo' : 'Exclusivo',
  }));

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic font-display">
            {content.common.featured_properties}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            Propiedades seleccionadas para los más exigentes.
          </p>
        </div>
        <Link
          href="#"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity"
        >
          Ver todas{' '}
          <FiArrowRight className="text-sm" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedCollection;
