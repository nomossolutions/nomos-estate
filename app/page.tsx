import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import FeaturedCollection from '@/components/FeaturedCollection';
import NewInMarket from '@/components/NewInMarket';
import { createClient } from '@/lib/supabase/server';
import content from '@/lib/i18n';
import { Property } from '@/types/property';

const PAGE_SIZE = 8;

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    type?: string;
    operation?: string;
    beds?: string;
    baths?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { page, location, minPrice, maxPrice, type, operation, beds, baths } =
    await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? '1', 10));
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (location) {
    query = query.or(`location.ilike.%${location}%,title.ilike.%${location}%`);
  }
  if (minPrice) {
    query = query.gte('price', parseInt(minPrice, 10));
  }
  if (maxPrice) {
    query = query.lte('price', parseInt(maxPrice, 10));
  }
  if (type && type !== 'Cualquier Tipo') {
    // We map 'type' from UI to the title since our schema uses title for 'Villa/House/etc.'
    query = query.ilike('title', `%${type}%`);
  }
  if (operation && (operation === 'sale' || operation === 'rent')) {
    query = query.eq('type', operation);
  }
  if (beds) {
    query = query.gte('beds', parseInt(beds, 10));
  }
  if (baths) {
    query = query.gte('baths', parseInt(baths, 10));
  }

  const { data: properties, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  const isFilterActive = !!(
    location ||
    minPrice ||
    maxPrice ||
    type ||
    operation ||
    beds ||
    baths
  );

  return (
    <>
      <Hero dict={content.hero} totalResults={count ?? 0} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <HowItWorks />
        {!isFilterActive && <FeaturedCollection />}
        <NewInMarket
          properties={(properties ?? []) as unknown as Property[]}
          totalCount={count ?? 0}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
        />
      </main>
    </>
  );
}
