import {
  FiMapPin,
  FiMove,
  FiHome,
  FiDroplet,
  FiNavigation,
  FiCheckCircle,
} from "react-icons/fi";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import DynamicPropertyMap from "@/components/DynamicPropertyMap";
import AgentContact from "@/components/AgentContact";
import ReadMore from "@/components/ReadMore";
import content from "@/lib/i18n";
import { cache } from "react";

const getProperty = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
});

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) return { title: "Propiedad No Encontrada" };

  return {
    title: `${property.title} | NomosEstate`,
    description: `Stunning property available for ${new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
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
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-8 space-y-4">
          <PropertyGallery
            images={property.images ?? []}
            title={property.title}
          />
        </div>

        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 space-y-6">
            <div className="bg-white p-6  border border-outline-variant/30 hover:shadow-elevated transition-all duration-400">
              <div className="mb-4">
                <h1 className="text-4xl font-display font-light text-charcoal mb-2">
                  {formattedPrice}
                </h1>
                <p className="text-charcoal/60 font-medium flex items-center gap-1">
                  <FiMapPin className="text-gold text-sm" />
                  {property.location}
                </p>
              </div>

              <div className="h-px bg-outline-variant/30 my-6"></div>

              <AgentContact
                scheduleVisitLabel={t.schedule_visit}
                contactAgentLabel={t.contact_agent}
              />
            </div>

            <div className="bg-white p-2 border border-outline-variant/30 hover:shadow-elevated transition-all duration-400">
              {property.lat && property.lng ? (
                <DynamicPropertyMap
                  lat={property.lat}
                  lng={property.lng}
                  address={property.location}
                />
              ) : (
                <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden bg-surface-dim flex items-center justify-center">
                  <span className="text-charcoal/50 font-medium">
                    {t.map_unavailable}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 lg:row-start-2 -mt-8 space-y-8">
          <div className="bg-white p-8 border border-outline-variant/30 hover:shadow-elevated transition-all duration-400">
            <h2 className="text-lg font-semibold mb-6 text-charcoal font-display">
              {t.property_features}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-gold/5 rounded-lg border border-gold/10">
                <FiMove className="text-gold text-2xl mb-2" />
                <span className="text-xl font-bold text-charcoal">
                  {property.sqft}
                </span>
                <span className="text-xs uppercase tracking-wider text-charcoal/50">
                  {t.square_meters}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gold/5 rounded-lg border border-gold/10">
                <FiHome className="text-gold text-2xl mb-2" />
                <span className="text-xl font-bold text-charcoal">
                  {property.beds}
                </span>
                <span className="text-xs uppercase tracking-wider text-charcoal/50">
                  {t.bedrooms}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gold/5 rounded-lg border border-gold/10">
                <FiDroplet className="text-gold text-2xl mb-2" />
                <span className="text-xl font-bold text-charcoal">
                  {property.baths}
                </span>
                <span className="text-xs uppercase tracking-wider text-charcoal/50">
                  {t.bathrooms}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gold/5 rounded-lg border border-gold/10">
                <FiNavigation className="text-gold text-2xl mb-2" />
                <span className="text-xl font-bold text-charcoal">
                  {property.parking ?? 0}
                </span>
                <span className="text-xs uppercase tracking-wider text-charcoal/50">
                  {t.garage}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-outline-variant/30 hover:shadow-elevated transition-all duration-400">
            <h2 className="text-lg font-semibold mb-4 text-charcoal font-display">
              {t.about_home}
            </h2>
            <ReadMore
              shortText={`Experimenta el lujo moderno en esta obra maestra arquitectónica ubicada en el corazón de ${property.location.split(",")[0] || "la ciudad"}.`}
              fullText={`Experimenta el lujo moderno en esta obra maestra arquitectónica ubicada en el corazón de ${property.location.split(",")[0] || "la ciudad"}. Diseñada con un enfoque en la vida interior-exterior, la residencia cuenta con ventanales de piso a techo que inundan los interiores de luz natural.

La cocina de concepto abierto está equipada con electrodomésticos de primera línea y gabinetes a medida, perfecta para los entusiastas de la gastronomía. La suite principal es un santuario de relajación con baño estilo spa y balcón privado.`}
              label={t.read_more}
            />
          </div>

          <div className="bg-white p-8 border border-outline-variant/30 hover:shadow-elevated transition-all duration-400">
            <h2 className="text-lg font-semibold mb-6 text-charcoal font-display">
              {t.amenities}
            </h2>
            {property.amenities && property.amenities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 text-charcoal/70">
                    <FiCheckCircle className="text-gold/60 text-sm" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-charcoal/50 text-sm">No hay comodidades especificadas.</p>
            )}
          </div>

          {/* <div className="bg-gold/5 p-6 rounded-lg border border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-full text-gold shadow-sm">
                <FiHash className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal font-display">
                  {t.estimated_payment}
                </h3>
                <p className="text-sm text-charcoal/60">
                  {t.starting_from}{" "}
                  <strong className="text-gold">$5,430/mes</strong> 20% {t.down}
                </p>
              </div>
            </div>
            <button className="whitespace-nowrap px-4 py-2 bg-white border border-charcoal/10 rounded-lg text-sm font-semibold hover:border-gold transition-colors text-charcoal cursor-pointer">
              {t.calculate_mortgage}
            </button>
          </div> */}
        </div>
      </div>
    </main>
  );
}
