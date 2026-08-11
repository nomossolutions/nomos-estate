'use client';

import { FiMap } from 'react-icons/fi';
import dynamic from 'next/dynamic';

const DynamicPropertyMap = dynamic(() => import('./PropertyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-4/3 rounded-lg bg-surface-dim flex items-center justify-center animate-pulse">
      <FiMap className="text-gold/30 text-4xl" />
    </div>
  ),
});

export default DynamicPropertyMap;
