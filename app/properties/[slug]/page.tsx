import { FiMapPin, FiMove, FiHome, FiDroplet, FiNavigation } from "react-icons/fi";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import DynamicPropertyMap from "@/components/DynamicPropertyMap";
import AgentContact from "@/components/AgentContact";
import ReadMore from "@/components/ReadMore";
import { Rule } from "@/components/ui/primitives";
import content from "@/lib/i18n";
import { cache } from "react";

/*
 * Ficha de propiedad — Folio y Sello.
 *
 * Lo que cambió: era una pila de cinco cajas blancas idénticas con
 * `hover:shadow-elevated`, cada una con sus propias esquinas redondeadas, más una
 * grilla de cuatro recuadros con fondo dorado para los metros, habitaciones,
 * baños y garaje. Eso era el cliché de "tarjetas anidadas".
 *
 * Ahora: una sola hoja continua separada por reglas, los datos técnicos como
 * registro en vez de recuadros, y el precio en la display como única pieza de escala
 * grande. El borde superior del folio lleva el número de serie.
 */

/*
 * Busca por slug y, si no encuentra, por id.
 *
 * Por qué: los enlaces del panel y de las tarjetas usan
 * `property.slug || property.id`, así que un enlace puede perfectamente traer un
 * id. Buscar solo por slug hacía que esa segunda mitad del fallback fuera
 * mentira: el enlace existía pero la página devolvía 404. Ahora las dos formas
 * resuelven.
 */
const getProperty = cache(async (slugOId: string) => {
  const supabase = await createClient();

  const { data: porSlug } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slugOId)
    .maybeSingle();
  if (porSlug) return porSlug;

  const esUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slugOId,
    );
  if (!esUuid) return null;

  const { data: porId } = await supabase
    .from("properties")
    .select("*")
    .eq("id", slugOId)
    .maybeSingle();
  return porId;
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

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(property.price);

  const esAlquiler = property.type === "rent";

  const especificaciones = [
    { icon: <FiMove />, valor: property.sqft, label: t.square_meters },
    { icon: <FiHome />, valor: property.beds, label: t.bedrooms },
    { icon: <FiDroplet />, valor: property.baths, label: t.bathrooms },
    { icon: <FiNavigation />, valor: property.parking ?? 0, label: t.garage },
  ];

  return (
    <main className="mx-auto max-w-tomo px-4 pt-28 pb-20 sm:px-6 lg:px-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Fotografías */}
        <div className="lg:col-span-8">
          <PropertyGallery
            images={property.images ?? []}
            title={property.title}
          />
        </div>

        {/* Datos y consultas */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h1 className="font-display text-tasacion font-normal text-tinta">
              {formattedPrice}
              {esAlquiler && (
                <span className="font-body text-menudo text-tinta-tenue">
                  {" "}
                  /mes
                </span>
              )}
            </h1>

            {/* Operación: el dato que interpreta el precio, como etiqueta */}
            <p className="indicador mt-3 text-tinta">
              {esAlquiler ? "En alquiler" : "En venta"}
            </p>

            <p className="mt-4 font-display text-lamina font-normal text-tinta">
              {property.title}
            </p>
            <p className="mt-2 flex items-start gap-2 text-menudo text-tinta-tenue">
              <FiMapPin aria-hidden="true" className="mt-0.5 shrink-0" />
              {property.location}
            </p>

            <div className="mt-8">
              <AgentContact
                scheduleVisitLabel={t.schedule_visit}
                contactAgentLabel={t.contact_agent}
              />
            </div>

            {/* Mapa */}
            <div className="mt-8">
              <Rule />
              <p className="indicador pb-4 pt-4">Ubicación</p>
              {property.lat && property.lng ? (
                <div className="relative aspect-4/3 w-full overflow-hidden border border-rule">
                  <DynamicPropertyMap
                    lat={property.lat}
                    lng={property.lng}
                    address={property.location}
                  />
                </div>
              ) : (
                <div className="flex aspect-4/3 w-full items-center justify-center border border-rule bg-hoja-baja">
                  <span className="text-menudo text-tinta-tenue">
                    {t.map_unavailable}
                  </span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Registro técnico */}
        <section className="lg:col-span-8">
          <Rule weight="fuerte" />
          <h2 className="indicador pb-2 pt-4">{t.property_features}</h2>

          <dl className="divide-y divide-rule">
            {especificaciones.map((fila) => (
              <div
                key={fila.label}
                className="flex items-baseline justify-between gap-6 py-5"
              >
                <dt className="flex items-center gap-3 text-menudo text-tinta-media">
                  <span aria-hidden="true" className="text-tinta-tenue">
                    {fila.icon}
                  </span>
                  {fila.label}
                </dt>
                <dd className="tabular font-display text-folio leading-none text-tinta">
                  {fila.valor}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Descripción y comodidades */}
        <div className="space-y-14 lg:col-span-8">
          <section>
            <Rule weight="fuerte" />
            <h2 className="indicador pb-4 pt-4">{t.about_home}</h2>
            <ReadMore
              shortText={`Experimenta el lujo moderno en esta obra maestra arquitectónica ubicada en el corazón de ${property.location.split(",")[0] || "la ciudad"}.`}
              fullText={`Experimenta el lujo moderno en esta obra maestra arquitectónica ubicada en el corazón de ${property.location.split(",")[0] || "la ciudad"}. Diseñada con un enfoque en la vida interior-exterior, la residencia cuenta con ventanales de piso a techo que inundan los interiores de luz natural.

La cocina de concepto abierto está equipada con electrodomésticos de primera línea y gabinetes a medida, perfecta para los entusiastas de la gastronomía. La suite principal es un santuario de relajación con baño estilo spa y balcón privado.`}
              label={t.read_more}
            />
          </section>

          <section>
            <Rule weight="fuerte" />
            <h2 className="indicador pb-4 pt-4">{t.amenities}</h2>
            {property.amenities && property.amenities.length > 0 ? (
              <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="border-b border-rule py-3 text-menudo text-tinta-media"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-menudo text-tinta-tenue">
                No hay comodidades especificadas.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
