import {
  FiMapPin, FiStar, FiMessageSquare, FiPhone, FiCalendar,
  FiMail, FiMove, FiHome, FiDroplet, FiNavigation,
  FiArrowRight, FiCheckCircle, FiHash
} from 'react-icons/fi';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PropertyGallery from '@/components/PropertyGallery';
import DynamicPropertyMap from '@/components/DynamicPropertyMap';
import Image from 'next/image';
import content from '@/lib/i18n';
import { cache } from 'react';

const getProperty = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
});

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);

    if (!property) return { title: 'Propiedad No Encontrada' };

  return {
    title: `${property.title} | NomosEstate`,
    description: `Stunning property available for ${new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      },
    ).format(property.price)}`,
    openGraph: {
      images: property.images,
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);

  const t = content.property_detail;

  if (!property) {
    notFound();
  }

  // Format currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 space-y-4">
            <PropertyGallery images={property.images ?? []} title={property.title} />
          </div>

          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-mosque/5">
                <div className="mb-4">
                  <h1 className="text-4xl font-display font-light text-nordic mb-2">
                    {formattedPrice}
                  </h1>
                  <p className="text-nordic/60 font-medium flex items-center gap-1">
                    <FiMapPin className="text-mosque text-sm" />
                    {property.location}
                  </p>
                </div>

                <div className="h-px bg-slate-100 my-6"></div>

                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w"
                    alt="Sarah Jenkins"
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-semibold text-nordic font-display">Sarah Jenkins</h3>
                    <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                      <FiStar className="text-sm" />
                      <span>{t.top_rated_agent}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none">
                      <FiMessageSquare className="text-sm" />
                    </button>
                    <button className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none">
                      <FiPhone className="text-sm" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-nordic hover:bg-nordic-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2 group focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none">
                    <FiCalendar className="text-xl group-hover:scale-110 transition-transform" />
                    {t.schedule_visit}
                  </button>
                  <button className="w-full bg-transparent border border-nordic/10 hover:border-mosque text-nordic/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none">
                    <FiMail className="text-xl" />
                    {t.contact_agent}
                  </button>
                </div>
              </div>

              <div className="bg-white p-2 rounded-lg shadow-sm border border-mosque/5">
                {property.lat && property.lng ? (
                  <DynamicPropertyMap
                    lat={property.lat}
                    lng={property.lng}
                    address={property.location}
                  />
                ) : (
                  <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                    <span className="text-nordic/50 font-medium">
                      {t.map_unavailable}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic font-display">
                {t.property_features}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <FiMove className="text-mosque text-2xl mb-2" />
                  <span className="text-xl font-bold text-nordic">
                    {property.sqft}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">
                    {t.square_meters}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <FiHome className="text-mosque text-2xl mb-2" />
                  <span className="text-xl font-bold text-nordic">
                    {property.beds}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">
                    {t.bedrooms}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <FiDroplet className="text-mosque text-2xl mb-2" />
                  <span className="text-xl font-bold text-nordic">
                    {property.baths}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">
                    {t.bathrooms}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-mosque/5 rounded-lg border border-mosque/10">
                  <FiNavigation className="text-mosque text-2xl mb-2" />
                  <span className="text-xl font-bold text-nordic">2</span>
                  <span className="text-xs uppercase tracking-wider text-nordic/50">
                    {t.garage}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-4 text-nordic font-display">
                {t.about_home}
              </h2>
              <div className="prose prose-slate max-w-none text-nordic/70 leading-relaxed">
                <p className="mb-4">
                  Experimenta el lujo moderno en esta obra maestra arquitectónica
                  ubicada en el corazón de{' '}
                  {property.location.split(',')[0] || 'la ciudad'}. Diseñada con
                  un enfoque en la vida interior-exterior, la residencia cuenta con
                  ventanales de piso a techo que inundan los interiores de luz
                  natural.
                </p>
                <p>
                  La cocina de concepto abierto está equipada con
                  electrodomésticos de primera línea y gabinetes a medida, perfecta
                  para los entusiastas de la gastronomía. La suite principal es un
                  santuario de relajación con baño estilo spa y balcón privado.
                </p>
              </div>
              <button className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                {t.read_more}
                <FiArrowRight className="text-sm" />
              </button>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-mosque/5">
              <h2 className="text-lg font-semibold mb-6 text-nordic font-display">
                {t.amenities}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex items-center gap-3 text-nordic/70">
                  <FiCheckCircle className="text-mosque/60 text-sm" />
                  <span>{t.smart_home}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <FiCheckCircle className="text-mosque/60 text-sm" />
                  <span>{t.swimming_pool}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <FiCheckCircle className="text-mosque/60 text-sm" />
                  <span>{t.heating_cooling}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <FiCheckCircle className="text-mosque/60 text-sm" />
                  <span>{t.ev_charging}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <FiCheckCircle className="text-mosque/60 text-sm" />
                  <span>{t.private_gym}</span>
                </div>
                <div className="flex items-center gap-3 text-nordic/70">
                  <FiCheckCircle className="text-mosque/60 text-sm" />
                  <span>{t.wine_cellar}</span>
                </div>
              </div>
            </div>

            <div className="bg-mosque/5 p-6 rounded-lg border border-mosque/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-full text-mosque shadow-sm">
                  <FiHash className="text-xl" />
                </div>
                <div>
                    <h3 className="font-semibold text-nordic font-display">
                      {t.estimated_payment}
                    </h3>
                  <p className="text-sm text-nordic/60">
                    {t.starting_from}{' '}
                    <strong className="text-mosque">$5,430/mes</strong> 20%{' '}
                    {t.down}
                  </p>
                </div>
              </div>
              <button className="whitespace-nowrap px-4 py-2 bg-white border border-nordic/10 rounded-lg text-sm font-semibold hover:border-mosque transition-colors text-nordic">
                {t.calculate_mortgage}
              </button>
            </div>
          </div>
        </div>
    </main>
  );
}
