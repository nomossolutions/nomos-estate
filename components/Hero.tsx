"use client";

import { useState, useCallback, useMemo, FormEvent } from "react";
import { FiSearch, FiSliders } from "react-icons/fi";
import FilterModal from "./ui/FilterModal";
import { useRouter, useSearchParams } from "next/navigation";

import Image from "next/image";
import heroimg from "@/public/heroimg2.jpg";

interface HeroDict {
  title_start: string;
  title_highlight: string;
  title_end: string;
  subtitle: string;
  search_placeholder: string;
  search_button: string;
}

interface HeroProps {
  dict: HeroDict;
  totalResults?: number;
}

export default function Hero({ dict, totalResults = 0 }: HeroProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("location") || "",
  );

  const filterInitialValues = {
    location: searchParams.get("location") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    propertyType: searchParams.get("type") || "Cualquier Tipo",
    beds: parseInt(searchParams.get("beds") || "0", 10),
    baths: parseInt(searchParams.get("baths") || "0", 10),
    amenities: searchParams.get("amenities")?.split(",").filter(Boolean) || [],
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("location", searchQuery.trim());
    } else {
      params.delete("location");
    }
    params.delete("page");
    router.push(`/?${params.toString()}`);
  };

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center justify-center pt-24 pb-12 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Luxury modern villa with pool"
          src={heroimg}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 hero-overlay"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-12 md:mt-0">
        {/* Eyebrow */}
        <p className="text-xs tracking-[0.2em] text-text-on-dark mb-6 font-medium uppercase">
          — B I E N E S R A Í C E S —
        </p>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-on-tertiary mb-6 max-w-4xl leading-tight font-display">
          {dict.title_start}
          <span className="relative inline-block">
            <span className="relative z-10 font-semibold">
              {dict.title_highlight}
            </span>
          </span>
          {dict.title_end}
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-surface-container-low mb-12 max-w-2xl font-light leading-relaxed">
          {dict.subtitle}
        </p>

        {/* Search Component - Glass Panel */}
        <div className="w-full max-w-3xl glass-panel rounded p-2 md:p-3 mb-10 flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-on-secondary-fixed-variant text-xl" />
            </div>
            <label htmlFor="hero-search" className="sr-only">
              {dict.search_placeholder}
            </label>
            <input
              id="hero-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-surface-container-lowest/90 border-none rounded text-on-surface placeholder:text-on-secondary-fixed-variant/70 focus:ring-2 focus:ring-tertiary-fixed-dim transition-all text-base"
              placeholder={dict.search_placeholder}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={openFilterModal}
              className="flex items-center justify-center h-14 px-6 bg-surface-container-lowest/90 rounded text-on-surface hover:bg-surface transition-colors border border-transparent hover:border-outline-variant cursor-pointer"
            >
              <FiSliders className="mr-2 text-base" />
              <span className="font-medium text-sm">Filtros</span>
            </button>
            <button
              type="submit"
              className="h-14 px-8 bg-primary text-on-primary rounded font-medium hover:bg-inverse-surface transition-colors text-sm cursor-pointer"
            >
              {dict.search_button}
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div
          className="flex flex-wrap justify-center gap-3 md:gap-4"
          role="tablist"
          aria-label="Tipo de propiedad"
        >
          {["Todos", "Casa", "Apartamento", "Villa", "Penthouse"].map((pt) => {
            const isActive = (searchParams.get("type") || "Todos") === pt;
            return (
              <button
                key={pt}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (pt === "Todos") {
                    params.delete("type");
                  } else {
                    params.set("type", pt);
                  }
                  params.delete("page");
                  router.push(`/?${params.toString()}`);
                }}
                className={`px-6 py-2 rounded text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none cursor-pointer ${
                  isActive
                    ? "glass-panel text-on-tertiary border-tertiary-fixed-dim/50"
                    : "glass-panel text-on-tertiary hover:bg-white/10"
                }`}
              >
                {pt}
              </button>
            );
          })}
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filterInitialValues}
        totalResults={totalResults}
      />
    </section>
  );
}
