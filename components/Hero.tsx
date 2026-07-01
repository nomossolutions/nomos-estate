'use client';

import { useState, FormEvent } from 'react';
import { FiSearch, FiSliders } from 'react-icons/fi';
import FilterModal from './ui/FilterModal';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const [filterModalKey, setFilterModalKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('location') || '',
  );

  const filterInitialValues = {
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    propertyType: searchParams.get('type') || 'Any Type',
    beds: parseInt(searchParams.get('beds') || '0', 10),
    baths: parseInt(searchParams.get('baths') || '0', 10),
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
  };

  const openFilterModal = () => {
    setFilterModalKey((k) => k + 1);
    setIsFilterModalOpen(true);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set('location', searchQuery.trim());
    } else {
      params.delete('location');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <section id="hero" className="relative py-12 md:py-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-mosque/[0.04] blur-3xl"></div>
        <div className="absolute top-[30%] right-[10%] w-[200px] h-[200px] rounded-full bg-mosque/[0.02] blur-2xl"></div>
        <div className="absolute top-[40%] left-[5%] w-[150px] h-[150px] rounded-full bg-mosque/[0.02] blur-2xl"></div>
      </div>

      <div className="relative max-w-3xl mx-auto text-center space-y-8">
        <p className="text-xs tracking-[0.3em] text-mosque/70 font-medium uppercase">
          —  B I E N E S   R A Í C E S  —
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic leading-tight font-display">
          {dict.title_start}
          <span className="relative inline-block">
            <span className="relative z-10 font-semibold">
              {dict.title_highlight}
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-3 bg-mosque/20 -rotate-1 z-0 rounded-sm"></span>
            <span className="absolute -bottom-1 left-1 w-full h-0.5 bg-mosque/70 -rotate-1 z-0 rounded-sm"></span>
          </span>
          {dict.title_end}
        </h1>

        <p className="text-base md:text-lg text-nordic-muted/90 font-light max-w-xl mx-auto leading-relaxed">
          {dict.subtitle}
        </p>

        <div className="flex items-center justify-center gap-3 w-40 mx-auto" aria-hidden="true">
          <span className="h-px flex-1 bg-gradient-to-l from-mosque/40 to-transparent"></span>
          <span className="w-1.5 h-1.5 rotate-45 border border-mosque/60 bg-mosque/10 flex-shrink-0"></span>
          <span className="h-px flex-1 bg-gradient-to-r from-mosque/40 to-transparent"></span>
        </div>

        <form
          onSubmit={handleSearch}
          className="relative group max-w-2xl mx-auto"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="text-nordic-muted text-2xl group-focus-within:text-mosque transition-colors" />
          </div>
          <label htmlFor="hero-search" className="sr-only">{dict.search_placeholder}</label>
          <input
            id="hero-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white text-nordic shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-lg"
            placeholder={dict.search_placeholder}
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 px-6 bg-nordic hover:bg-nordic-hover text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-black/10"
          >
            {dict.search_button}
          </button>
        </form>

        <div className="flex items-center justify-center gap-3 overflow-x-auto hide-scroll py-2 px-4 -mx-4">
          {['Todos', 'Casa', 'Apartamento', 'Villa', 'Penthouse'].map((pt) => {
            const isActive = (searchParams.get('type') || 'Todos') === pt;
            return (
              <button
                key={pt}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (pt === 'Todos') {
                    params.delete('type');
                  } else {
                    params.set('type', pt);
                  }
                  params.delete('page');
                  router.push(`/?${params.toString()}`);
                }}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none ${
                  isActive
                    ? 'bg-nordic text-white shadow-lg shadow-nordic/10 hover:-translate-y-0.5'
                    : 'bg-white border border-nordic/5 text-nordic-muted hover:text-nordic hover:border-mosque/50 hover:bg-mosque/5'
                }`}
              >
                {pt}
              </button>
            );
          })}
          <div className="w-px h-6 bg-nordic/10 mx-2"></div>
          <button
            onClick={openFilterModal}
            className="whitespace-nowrap flex items-center gap-1 px-4 py-2 rounded-full text-nordic font-medium text-sm hover:bg-black/5 transition-colors focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none"
          >
            <FiSliders className="text-base" />
              Filtros
          </button>
        </div>
      </div>

      <FilterModal
        key={filterModalKey}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={filterInitialValues}
        totalResults={totalResults}
      />
    </section>
  );
}
