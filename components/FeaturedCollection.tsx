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
    <section className="py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-light text-charcoal font-display">
            {content.common.featured_properties}
          </h2>
          <div className="w-12 h-0.5 bg-gold/50 mt-3"></div>
          <p className="text-text-muted mt-3 text-sm">
            Propiedades seleccionadas para los más exigentes.
          </p>
        </div>
        <Link
          href="/#properties"
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-gold hover:opacity-70 transition-opacity shrink-0"
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
