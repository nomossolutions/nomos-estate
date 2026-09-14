import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Rule, SectionHeading } from "@/components/ui/primitives";
import content from "@/lib/i18n";

/*
 * Sobre nosotros — Folio y Sello.
 *
 * Lo que cambió: se fue el hero centrado con dos manchas de blur decorativas, el
 * icono en caja carbón, la grilla de cuatro cards con icono en círculo dorado y
 * `hover:-translate-y-1`, y el CTA con botón dorado sobre bloque carbón.
 *
 * Ahora se lee como la declaración de intención de un tomo: cifras y datos en un
 * registro de definición, la misión y la visión separadas por reglas, y las
 * secciones alineadas al margen — nada centrado.
 *
 * El copy se conserva tal cual (viene de lib/i18n.ts).
 */

export const metadata = {
  title: "Sobre Nosotros | NomosEstate",
  description:
    "Conoce más sobre NomosEstate, nuestra misión, visión y el equipo que hace posible la mejor experiencia inmobiliaria.",
};

export default function AboutPage() {
  const t = content.about;

  return (
    <main className="mx-auto max-w-tomo px-4 pt-28 pb-20 sm:px-6 lg:px-10">
      {/* Declaración */}
      <div className="border-t border-rule pb-4 pt-5">
        <span className="indicador">Declaración · Sobre el estudio</span>
      </div>

      <h1 className="max-w-[20ch] font-display text-display font-normal text-tinta">
        {t.title}
      </h1>
      <p className="mt-7 max-w-[58ch] text-cuerpo text-tinta-media">
        {t.subtitle}
      </p>

      <Rule weight="doble" className="mt-16" />

      {/* Misión y visión como registro, no como cards */}
      <dl className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2">
        <div>
          <dt className="indicador tabular text-tinta">01 — Misión</dt>
          <dd>
            <h2 className="mt-3 font-display text-folio font-normal text-tinta">
              {t.mission_title}
            </h2>
            <p className="mt-3 max-w-[58ch] text-cuerpo text-tinta-media">
              {t.mission_text}
            </p>
          </dd>
        </div>
        <div>
          <dt className="indicador tabular text-tinta">02 — Visión</dt>
          <dd>
            <h2 className="mt-3 font-display text-folio font-normal text-tinta">
              {t.vision_title}
            </h2>
            <p className="mt-3 max-w-[58ch] text-cuerpo text-tinta-media">
              {t.vision_text}
            </p>
          </dd>
        </div>
      </dl>

      {/* Valores */}
      <section className="mt-24">
        <SectionHeading title={t.values_title} />
        <ul className="mt-12 grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
          {t.values.map((value, idx) => (
            <li
              key={value.title}
              className="border-t border-tinta py-6"
            >
              <span className="indicador tabular text-tinta">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-folio font-normal text-tinta">
                {value.title}
              </h3>
              <p className="mt-2 max-w-[34ch] text-menudo leading-relaxed text-tinta-tenue">
                {value.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Equipo */}
      <section className="mt-24">
        <Rule weight="fuerte" />
        <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-12">
          <h2 className="font-display text-titulo font-normal text-tinta md:col-span-5">
            {t.team_title}
          </h2>
          <p className="max-w-[58ch] text-cuerpo text-tinta-media md:col-span-7">
            {t.team_text}
          </p>
        </div>
      </section>

      {/* Cierre */}
      <section className="mt-24 border-t-2 border-tinta bg-tinta px-8 py-14 text-hoja sm:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-[22ch] font-display text-titulo font-normal">
              {t.cta_title}
            </h2>
            <p className="mt-5 max-w-[52ch] text-cuerpo text-hoja/65">
              {t.cta_text}
            </p>
          </div>
          <Link
            href="/#propiedades"
            className="group inline-flex h-14 shrink-0 items-center gap-3 border border-hoja bg-hoja px-7 text-menudo font-medium text-tinta transition-colors hover:bg-hoja-baja"
          >
            {t.cta_button}
            <FiArrowRight
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </main>
  );
}
