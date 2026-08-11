"use client";

import { useState } from "react";
import { FiArrowRight, FiArrowUp } from "react-icons/fi";

interface ReadMoreProps {
  shortText: string;
  fullText: string;
  label: string;
}

export default function ReadMore({ shortText, fullText, label }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="prose prose-slate max-w-none text-charcoal/70 leading-relaxed">
        <p className="mb-4">{expanded ? fullText : shortText}</p>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="mt-4 text-gold font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
      >
        {expanded ? "Leer menos" : label}
        {expanded ? (
          <FiArrowUp className="text-sm" />
        ) : (
          <FiArrowRight className="text-sm" />
        )}
      </button>
    </div>
  );
}
