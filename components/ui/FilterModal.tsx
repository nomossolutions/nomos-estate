'use client';

import {
  FiX, FiMapPin, FiChevronDown, FiMinus, FiPlus,
  FiArrowRight, FiDroplet, FiActivity, FiNavigation,
  FiWind, FiWifi, FiSun
} from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FilterInitialValues {
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  beds: number;
  baths: number;
  amenities: string[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalResults?: number;
  initialFilters: FilterInitialValues;
}

const AMENITIES = [
  { id: 'pool', label: 'Piscina', icon: <FiDroplet className="text-lg" /> },
  { id: 'gym', label: 'Gimnasio', icon: <FiActivity className="text-lg" /> },
  { id: 'parking', label: 'Estacionamiento', icon: <FiNavigation className="text-lg" /> },
  { id: 'ac', label: 'Aire Acondicionado', icon: <FiWind className="text-lg" /> },
  { id: 'wifi', label: 'WiFi de Alta Velocidad', icon: <FiWifi className="text-lg" /> },
  { id: 'patio', label: 'Patio / Terraza', icon: <FiSun className="text-lg" /> },
];

export default function FilterModal({
  isOpen,
  onClose,
  totalResults = 0,
  initialFilters,
}: FilterModalProps) {
  const router = useRouter();

  // Local state for filters
  const [location, setLocation] = useState(initialFilters.location);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [propertyType, setPropertyType] = useState(initialFilters.propertyType);
  const [beds, setBeds] = useState(initialFilters.beds);
  const [baths, setBaths] = useState(initialFilters.baths);
  const [amenities, setAmenities] = useState(initialFilters.amenities);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (propertyType && propertyType !== 'Any Type')
      params.set('type', propertyType);
    if (beds > 0) params.set('beds', beds.toString());
    if (baths > 0) params.set('baths', baths.toString());
    if (amenities.length > 0) params.set('amenities', amenities.join(','));

    // Always reset to first page when filtering
    params.delete('page');

    router.push(`/?${params.toString()}`);
    onClose();
  };

  const handleClear = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setPropertyType('Any Type');
    setBeds(0);
    setBaths(0);
    setAmenities([]);
    router.push('/');
    onClose();
  };

  const toggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-mosque/40 backdrop-blur-sm z-100 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Main Modal Container */}
      <div className="fixed inset-0 z-110 flex items-center justify-center p-4 pointer-events-none">
        <main className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto">
          {/* Header */}
          <header className="px-4 sm:px-6 lg:px-8 py-6 border-b border-nordic/10 flex justify-between items-center bg-white sticky top-0 z-30">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-nordic font-display">
              Filtros
            </h1>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-nordic/5 transition-colors text-nordic-muted focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none"
            >
              <FiX className="text-xl" />
            </button>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto hide-scroll p-4 sm:p-6 lg:p-8 space-y-10">
            {/* Section 1: Location */}
            <section>
              <label htmlFor="filter-location" className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-3">
                Ubicación
              </label>
              <div className="relative group">
                <FiMapPin className="absolute left-4 top-3.5 text-nordic-muted group-focus-within:text-mosque transition-colors" />
                <input
                  id="filter-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-nordic/10 rounded-lg text-nordic placeholder-nordic-muted/50 focus:ring-2 focus:ring-mosque focus:border-mosque transition-all shadow-sm"
                  placeholder="Ciudad, barrio o dirección"
                />
              </div>
            </section>

            {/* Section 2: Price Range */}
            <section>
              <div className="flex justify-between items-end mb-4">
                <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">
                  Rango de Precio
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-nordic/10 p-3 rounded-lg focus-within:border-mosque/50 focus-within:ring-1 focus-within:ring-mosque/50 transition-colors">
                  <label htmlFor="filter-min-price" className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">
                    Precio Mín
                  </label>
                  <div className="flex items-center">
                    <span className="text-nordic-muted mr-1">$</span>
                    <input
                      id="filter-min-price"
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-transparent border-0 p-0 text-nordic font-medium focus:ring-0 text-sm placeholder:text-nordic-muted/40"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="bg-white border border-nordic/10 p-3 rounded-lg focus-within:border-mosque/50 focus-within:ring-1 focus-within:ring-mosque/50 transition-colors">
                  <label htmlFor="filter-max-price" className="block text-[10px] text-nordic-muted uppercase font-medium mb-1">
                    Precio Máx
                  </label>
                  <div className="flex items-center">
                    <span className="text-nordic-muted mr-1">$</span>
                    <input
                      id="filter-max-price"
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-transparent border-0 p-0 text-nordic font-medium focus:ring-0 text-sm placeholder:text-nordic-muted/40"
                      placeholder="Cualquier"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Property Details */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Property Type */}
              <div className="space-y-3">
                <label htmlFor="filter-property-type" className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider">
                  Tipo de Propiedad
                </label>
                <div className="relative">
                  <select
                    id="filter-property-type"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-white border border-nordic/10 rounded-lg py-3 pl-4 pr-10 text-nordic appearance-none focus:ring-2 focus:ring-mosque focus:border-mosque cursor-pointer"
                  >
                    <option>Cualquier Tipo</option>
                    <option>Casa</option>
                    <option>Apartamento</option>
                    <option>Condominio</option>
                    <option>Townhouse</option>
                    <option>Villa</option>
                    <option>Penthouse</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-nordic-muted pointer-events-none" />
                </div>
              </div>

              {/* Rooms */}
              <div className="space-y-4">
                {/* Beds */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-nordic">
                    Dormitorios
                  </span>
                  <div className="flex items-center space-x-3 bg-white border border-nordic/10 rounded-full p-1">
                    <button
                      onClick={() => setBeds(Math.max(0, beds - 1))}
                      className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-nordic-muted hover:text-mosque disabled:opacity-50 transition-colors focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none"
                    >
                      <FiMinus className="text-base" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {beds > 0 ? `${beds}+` : 'Cualquier'}
                    </span>
                    <button
                      onClick={() => setBeds(beds + 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none"
                    >
                      <FiPlus className="text-base" />
                    </button>
                  </div>
                </div>

                {/* Baths */}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-nordic">
                    Baños
                  </span>
                  <div className="flex items-center space-x-3 bg-white border border-nordic/10 rounded-full p-1">
                    <button
                      onClick={() => setBaths(Math.max(0, baths - 1))}
                      className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-nordic-muted hover:text-mosque disabled:opacity-50 transition-colors"
                    >
                      <FiMinus className="text-base" />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">
                      {baths > 0 ? `${baths}+` : 'Cualquier'}
                    </span>
                    <button
                      onClick={() => setBaths(baths + 1)}
                      className="w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors"
                    >
                      <FiPlus className="text-base" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Amenities */}
            <section>
              <label className="block text-xs font-semibold text-nordic-muted uppercase tracking-wider mb-4">
                Comodidades &amp; Características
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES.map((amenity) => {
                  const isActive = amenities.includes(amenity.id);
                  return (
                    <label
                      key={amenity.id}
                      className="cursor-pointer group relative"
                    >
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={isActive}
                        onChange={() => toggleAmenity(amenity.id)}
                      />
                      <div
                        className={`h-full px-4 py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all ${
                          isActive
                            ? 'border-mosque bg-mosque/5 text-mosque font-medium hover:bg-mosque/10'
                            : 'border-nordic/10 bg-white text-nordic-muted hover:border-nordic/30 hover:bg-black/5'
                        }`}
                      >
                        <span className={`${isActive ? '' : 'text-nordic-muted group-hover:text-nordic'}`}>
                          {amenity.icon}
                        </span>
                        <span>{amenity.label}</span>
                      </div>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full opacity-100 transition-opacity"></div>
                      )}
                    </label>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-nordic/10 px-4 sm:px-6 lg:px-8 py-6 sticky bottom-0 z-30 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="text-xs sm:text-sm font-medium text-nordic-muted hover:text-nordic transition-colors underline decoration-nordic/20 underline-offset-4 focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none rounded"
            >
              Limpiar filtros
            </button>
            <button
              onClick={handleApply}
              className="bg-nordic hover:bg-nordic-hover text-white px-4 sm:px-8 py-3 rounded-lg font-medium shadow-lg shadow-black/10 transition-all hover:shadow-black/20 flex items-center gap-2 transform active:scale-95 focus-visible:ring-2 focus-visible:ring-mosque focus-visible:outline-none text-sm"
            >
              <span className="hidden sm:inline">{totalResults > 0 ? `Mostrar ${totalResults} Propiedades` : 'Mostrar Propiedades'}</span>
              <span className="sm:hidden">{totalResults > 0 ? `${totalResults} Prop.` : 'Aplicar'}</span>
              <FiArrowRight className="text-sm" />
            </button>
          </footer>
        </main>
      </div>
    </>
  );
}
