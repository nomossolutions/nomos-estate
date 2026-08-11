"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FiGrid, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Image from "next/image";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({
  images,
  title,
}: PropertyGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = () =>
    setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const nextImage = () =>
    setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const lightboxRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (lightboxOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const el = lightboxRef.current;
      if (el) {
        const focusable = el.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
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
    []
  );

  return (
    <div className="space-y-4">
      <div className="relative aspect-16/10 overflow-hidden shadow-sm group">
        <Image
          src={images[activeImage]}
          alt={`${title} - Vista Principal`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-surface/90 backdrop-blur-md px-3 py-1 rounded-sm text-xs font-medium uppercase tracking-wider shadow-sm">
            Premium
          </span>
        </div>
        <button
          onClick={() => openLightbox(activeImage)}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-charcoal px-3 sm:px-4 py-2 rounded-lg text-sm font-medium shadow-elevated backdrop-blur transition-all flex items-center gap-2 cursor-pointer"
        >
          <FiGrid className="text-sm" />
          <span className="hidden sm:inline">
            Ver todas las {images.length} fotos
          </span>
          <span className="sm:hidden">{images.length} fotos</span>
        </button>
      </div>

      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto scrollbar-hide p-2 snap-x">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
              aria-pressed={activeImage === idx}
              className={`flex-none w-48 aspect-4/3 relative overflow-hidden cursor-pointer snap-start transition-all rounded ${
                activeImage === idx
                  ? "ring-2 ring-gold ring-offset-2 ring-offset-clear-day"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} - Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="192px"
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
          aria-label="Galería de imágenes"
          onKeyDown={handleLightboxKeyDown}
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 text-white/70 hover:text-white transition-colors z-10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none rounded cursor-pointer"
            aria-label="Cerrar galería"
          >
            <FiX className="text-2xl" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 p-3 text-white/70 hover:text-white transition-colors z-10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none rounded cursor-pointer"
            aria-label="Imagen anterior"
          >
            <FiChevronLeft className="text-3xl" />
          </button>

          <div
            className="relative w-full max-w-5xl h-[80vh] mx-4 sm:mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${title} - Vista ${lightboxIndex + 1} de ${images.length}`}
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
            className="absolute right-4 p-3 text-white/70 hover:text-white transition-colors z-10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none rounded cursor-pointer"
            aria-label="Imagen siguiente"
          >
            <FiChevronRight className="text-3xl" />
          </button>

          <div className="absolute bottom-4 text-white/60 text-sm" aria-live="polite">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
