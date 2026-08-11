import { FiSearch } from 'react-icons/fi';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-clear-day min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-2xl mb-6 text-gold">
          <FiSearch className="text-3xl" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal mb-2">
          Página no encontrada
        </h1>
        <p className="text-text-muted text-sm mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          href="/"
          className="inline-block bg-charcoal hover:bg-charcoal-hover text-white font-semibold text-sm rounded-lg px-6 py-3 transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
