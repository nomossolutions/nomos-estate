'use client';

import { FiAlertCircle } from 'react-icons/fi';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-clear-day min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-burgundy/10 rounded-2xl mb-6 text-burgundy">
          <FiAlertCircle className="text-3xl" />
        </div>
        <h1 className="text-2xl font-bold text-charcoal mb-2">
          Algo salió mal
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Ocurrió un error inesperado. Por favor, inténtalo de nuevo.
        </p>
        <button
          onClick={reset}
          className="bg-charcoal hover:bg-charcoal-hover text-white font-semibold text-sm rounded-lg px-6 py-3 transition-colors cursor-pointer"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
