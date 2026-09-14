import type { ReactNode } from "react";

/*
 * Primitivas tipográficas y de línea del mundo "Folio y Sello".
 * Regla: las superficies se definen por líneas de 1px, nunca por sombras, y las
 * etiquetas de máquina (índice, serie) viven colgando en el margen.
 */

/** Único separador del mundo, en tres pesos. Separa, no adorna. */
export function Rule({
  weight = "fina",
  className = "",
}: {
  weight?: "fina" | "fuerte" | "doble";
  className?: string;
}) {
  if (weight === "doble") {
    return (
      <div
        aria-hidden="true"
        className={`h-[5px] border-b border-b-rule-fuerte border-t border-t-tinta ${className}`}
      />
    );
  }
  return (
    <hr
      className={`border-0 ${
        weight === "fuerte" ? "h-px bg-tinta" : "h-px bg-rule"
      } ${className}`}
    />
  );
}

/*
 * SectionHeading: encabezado alineado al margen izquierdo.
 *
 * Lo que existe para NO hacer: nada de centrado con subtítulo debajo, nada de
 * eyebrow/kicker arriba del título (prohibición dura del craft floor: el título
 * se sostiene solo), nada de hairline dorada de adorno.
 *
 * Lo que sí hace: el índice cuelga en el margen, como la foliación de un tomo.
 */
export function SectionHeading({
  index,
  title,
  measure,
  action,
  className = "",
}: {
  index?: string;
  title: string;
  measure?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <header className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative sm:pl-14">
          {index && (
            <span
              aria-hidden="true"
              className="indicador tabular absolute left-0 top-[0.7em] hidden sm:block"
            >
              {index}
            </span>
          )}
          <h2 className="font-display text-titulo font-normal text-tinta">
            {title}
          </h2>
          {measure && (
            <p className="mt-3 max-w-[62ch] text-menudo text-tinta-tenue">
              {measure}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
