"use client";

import { useState } from "react";
import { FiArrowRight, FiArrowUp } from "react-icons/fi";

/*
 * ReadMore — Folio y Sello.
 * Lo que cambió: se fue `prose` (que arrastra su propia escala tipográfica fuera
 * del sistema) y el link dorado con salto de gap. Ahora es texto del sistema con
 * una acción terciaria subrayada.
 */

interface ReadMoreProps {
  shortText: string;
  fullText: string;
  label: string;
}

export default function ReadMore({ shortText, fullText, label }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p className="max-w-[68ch] whitespace-pre-line text-cuerpo leading-relaxed text-tinta-media">
        {expanded ? fullText : shortText}
      </p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="group mt-5 inline-flex items-center gap-2 border-b border-transparent pb-1 text-menudo font-medium text-tinta transition-colors hover:border-tinta"
      >
        {expanded ? "Leer menos" : label}
        {expanded ? (
          <FiArrowUp
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-y-0.5"
          />
        ) : (
          <FiArrowRight
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        )}
      </button>
    </div>
  );
}
