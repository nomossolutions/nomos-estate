import { Rule } from "./ui/primitives";

/*
 * HowItWorks — Folio y Sello.
 *
 * Lo que cambió: se fue el icono en círculo con borde dorado, el badge numerado
 * superpuesto y la hairline dorada centrada debajo del título. Eso era el patrón
 * más repetido de la interfaz.
 *
 * Los pasos se presentan como un registro: el número vive en el canto, la
 * secuencia se lee por la línea que las une, y cada paso tiene un título y una
 * línea de qué hace el sistema — sin métricas inventadas.
 */

const PASOS = [
  {
    numero: "01",
    titulo: "Filtrá",
    detalle:
      "Acotá el catálogo por localidad, precio, tipo de propiedad y cantidad de ambientes.",
  },
  {
    numero: "02",
    titulo: "Revisá",
    detalle:
      "Cada propiedad tiene su ficha: fotos, ubicación en el mapa, metros, garaje y comodidades.",
  },
  {
    numero: "03",
    titulo: "Coordiná",
    detalle:
      "Escribile al agente desde la ficha y agendá la visita sin salir de la plataforma.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24">
      <h2 className="font-display text-titulo font-normal text-tinta">
        Cómo funciona
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-12 md:gap-y-0">
        {PASOS.map((paso, idx) => (
          <div key={paso.numero} className="flex flex-col">
            <Rule weight={idx === 0 ? "fuerte" : "fina"} />
            <span className="indicador tabular mt-5 text-tinta">
              {paso.numero}
            </span>
            <h3 className="mt-3 font-display text-folio font-normal text-tinta">
              {paso.titulo}
            </h3>
            <p className="mt-3 max-w-[38ch] text-menudo leading-relaxed text-tinta-tenue">
              {paso.detalle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
