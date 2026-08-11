"use client";

import PropertyCard from './ui/PropertyCard';
import Pagination from './Pagination';
import { Property } from '@/types/property';
import content from '@/lib/i18n';
import { useRouter, useSearchParams } from 'next/navigation';

interface NewInMarketProps {
  properties: Property[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

const NewInMarket = ({
  properties,
  totalCount,
  currentPage,
  pageSize,
}: NewInMarketProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentOperation = searchParams.get('operation') || '';

  const handleOperationChange = (operation: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (operation) {
      params.set('operation', operation);
    } else {
      params.delete('operation');
    }
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  const tabClass = (active: boolean) =>
    `px-4 py-1.5 rounded text-sm font-medium cursor-pointer transition-colors ${
      active ? 'bg-charcoal text-white shadow-sm' : 'text-text-muted hover:text-charcoal'
    }`;

  const mobileTabClass = (active: boolean) =>
    `whitespace-nowrap px-4 py-1.5 rounded text-sm font-medium cursor-pointer transition-colors ${
      active
        ? 'bg-charcoal text-white shadow-sm'
        : 'bg-white text-text-muted border border-charcoal/10 hover:text-charcoal'
    }`;

  return (
    <section id="properties" className="py-16">
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-light text-charcoal font-display">
              {content.common.new_in_market}
            </h2>
            <div className="w-12 h-0.5 bg-gold/50 mt-3"></div>
            <p className="text-text-muted mt-3 text-sm">
              Oportunidades frescas agregadas esta semana.
            </p>
          </div>
          <div className="hidden md:flex bg-white p-1 rounded shrink-0" role="group" aria-label="Filtrar por operación">
            <button onClick={() => handleOperationChange('')} aria-pressed={!currentOperation} className={tabClass(!currentOperation)}>
              Todas
            </button>
            <button onClick={() => handleOperationChange('sale')} aria-pressed={currentOperation === 'sale'} className={tabClass(currentOperation === 'sale')}>
              Comprar
            </button>
            <button onClick={() => handleOperationChange('rent')} aria-pressed={currentOperation === 'rent'} className={tabClass(currentOperation === 'rent')}>
              Alquilar
            </button>
          </div>
        </div>
        <div className="flex md:hidden overflow-x-auto hide-scroll gap-2 -mx-4 px-4" role="group" aria-label="Filtrar por operación">
          <button onClick={() => handleOperationChange('')} aria-pressed={!currentOperation} className={mobileTabClass(!currentOperation)}>
            Todas
          </button>
          <button onClick={() => handleOperationChange('sale')} aria-pressed={currentOperation === 'sale'} className={mobileTabClass(currentOperation === 'sale')}>
            Comprar
          </button>
          <button onClick={() => handleOperationChange('rent')} aria-pressed={currentOperation === 'rent'} className={mobileTabClass(currentOperation === 'rent')}>
            Alquilar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl="/"
        prevLabel={content.common.previous}
        nextLabel={content.common.next}
        searchString={searchParams.toString()}
      />
    </section>
  );
};

export default NewInMarket;
