/*
 * Tipo de la pieza destacada del catálogo.
 *
 * Antes vivía en `data/mockData.ts`, junto a 16 propiedades de ejemplo y dos
 * arrays (`featuredCollections`, `newInMarket`) que ya no importaba nadie: la
 * colección se arma desde Supabase. Se retiró ese archivo y el tipo quedó acá,
 * que es su lugar.
 *
 * `isNew` e `isFeatured` son dos hechos distintos y por eso son dos campos:
 *   - `isFeatured` es curaduría del equipo — "esta la destacamos nosotros".
 *   - `isNew` es temporal y se DERIVA de `created_at`: "entró al catálogo hace
 *     poco". No hay una columna que lo controle, justamente para que no pueda
 *     desincronizarse del hecho que representa.
 */

export interface Collection {
  id: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  slug?: string;
  beds: number;
  baths: number;
  sqft: number;
  isFeatured: boolean;
  isNew: boolean;
}
