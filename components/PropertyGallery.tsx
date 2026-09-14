"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FiGrid, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Image from "next/image";

/*
 * PropertyGallery — Folio y Sello.
 *
 * Lo que cambió: se fue el badge "Premium" — un claim que la plataforma no puede
 * sostener, porque no existe ningún campo de calidad en el schema y por lo tanto
 * TODA propiedad se anunciaba igual de "premium" — y se fue la sombra más el zoom
 * del contenedor. Ahora se informa la serie de láminas de verdad: en cuál estás y
 * cuántas hay, que es lo que el usuario necesita para orientarse.
 *
 * Bug corregido: había un `return null` temprano ANTES de los hooks (`useRef`,
 * `useEffect`, `useCallback`), lo que rompe la regla de orden de hooks de React.
 * Se resolvió separando el contenedor del componente que sí usa hooks.
 */

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery(props: PropertyGalleryProps) {
  if (!props.images || props.images.length === 0) return null;
  // `key` remonta el componente si cambia el juego de láminas, así el índice
  // activo nunca queda apuntando a una lámina que ya no existe.
  return <Gallery key={props.images.join("|")} {...props} />;
}

function Gallery({ images, title }: PropertyGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const lightboxRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const prevImage = useCallback(
    () => setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1)),
    [images.length],
  );

  const nextImage = useCallback(
    () => setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1)),
    [images.length],
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (lightboxOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const el = lightboxRef.current;
      if (el) {
        const focusable = el.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length > 0) focusable[0].focus();
      }
    } else {
      previousFocusRef.current?.focus();
    }
  }, [lightboxOpen]);

  const handleLightboxKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    },
    [closeLightbox, prevImage, nextImage],
  );

  return (
    <div>
      {/* Contador de imágenes: información, sin ceremonia */}
      <div className="flex items-baseline justify-between gap-4 pb-4">
        <span className="indicador tabular text-tinta">
          {activeImage + 1} / {images.length}
        </span>
      </div>

      <div className="relative aspect-16/10 w-full overflow-hidden bg-hoja-baja">
        <Image
          src={images[activeImage]}
          alt={`${title} — vista ${activeImage + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        <button
          type="button"
          onClick={() => openLightbox(activeImage)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 border border-tinta bg-hoja px-4 py-2.5 text-menudo font-medium text-tinta transition-colors hover:bg-hoja-baja"
        >
          <FiGrid aria-hidden="true" />
          <span className="hidden sm:inline">
            Ver las {images.length} fotos
          </span>
          <span className="sm:hidden">{images.length} fotos</span>
        </button>
      </div>

      {/* Tira de contacto: la foto activa se marca con la forma de la línea */}
      {images.length > 1 && (
        <div className="hide-scroll mt-4 flex snap-x gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(idx)}
              aria-label={`Ver foto ${idx + 1}`}
              aria-pressed={activeImage === idx}
              className={`relative aspect-4/3 w-40 flex-none snap-start overflow-hidden transition-opacity ${
                activeImage === idx
                  ? "opacity-100"
                  : "opacity-55 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
                sizes="160px"
              />
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-[3px] ${
                  activeImage === idx ? "bg-laton" : "bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotos"
          onKeyDown={handleLightboxKeyDown}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-tinta/95"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center border border-hoja/25 text-hoja/70 transition-colors hover:border-hoja hover:text-hoja"
            aria-label="Cerrar galería"
          >
            <FiX className="text-xl" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center border border-hoja/25 text-hoja/70 transition-colors hover:border-hoja hover:text-hoja"
            aria-label="Imagen anterior"
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <div
            className="relative mx-4 h-[80vh] w-full max-w-5xl sm:mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${title} — vista ${lightboxIndex + 1} de ${images.length}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center border border-hoja/25 text-hoja/70 transition-colors hover:border-hoja hover:text-hoja"
            aria-label="Imagen siguiente"
          >
            <FiChevronRight className="text-2xl" />
          </button>

          <p
            className="indicador tabular absolute bottom-6 text-hoja/60"
            aria-live="polite"
          >
            {lightboxIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
  );
}
