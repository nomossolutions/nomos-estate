'use client';

import { FiMap } from 'react-icons/fi';
import dynamic from 'next/dynamic';

/*
 * DynamicPropertyMap — Sala Blanca.
 *
 * Leaflet necesita el DOM, así que se carga sin SSR. Lo que cambió: el
 * placeholder de carga quedó con el vocabulario del sistema anterior —dorado al
 * 30%, radio grande y un `animate-pulse`— y no coincidía con nada. Ahora usa los
 * tokens del mundo y el mismo radio que el resto.
 */

const DynamicPropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-4/3 w-full items-center justify-center rounded border border-rule bg-hoja-baja">
      <FiMap
        aria-hidden="true"
        className="text-4xl text-tinta-tenue/40"
      />
      <span className="sr-only">Cargando el mapa…</span>
    </div>
  ),
});

export default DynamicPropertyMap;
