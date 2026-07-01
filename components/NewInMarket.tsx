import PropertyCard from './ui/PropertyCard';
import Pagination from './Pagination';
import { Property } from '@/types/property';
import content from '@/lib/i18n';

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

  return (
    <section id="properties">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic font-display">
            {content.common.new_in_market}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            Oportunidades frescas agregadas esta semana.
          </p>
        </div>
        <div className="hidden md:flex bg-white p-1 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-sm font-medium bg-nordic text-white shadow-sm">
            Todas
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic">
            Comprar
          </button>
          <button className="px-4 py-1.5 rounded-md text-sm font-medium text-nordic-muted hover:text-nordic">
            Alquilar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      />
    </section>
  );
};

export default NewInMarket;
