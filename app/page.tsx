import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import FeaturedCollection from '@/components/FeaturedCollection';
import NewInMarket from '@/components/NewInMarket';
import { createClient } from '@/lib/supabase/server';
import { getCategoriasActivas } from '@/lib/categories';
import content from '@/lib/i18n';
import { Property } from '@/types/property';

/*
 * 9 por página, no 8.
 *
 * La grilla del catálogo es de 3 columnas en desktop y 2 en tablet. Con 8, la
 * última fila quedaba con 2 tarjetas de 3 y se veía un hueco. Con 9 llena 3×3 en
 * desktop y 2 columnas con 4 filas + 1 en tablet — que es el resto menos visible.
 */
const PAGE_SIZE = 9;

/**
 * Lee un parámetro numérico de la URL sin propagar NaN.
 *
 * Bug corregido: `parseInt('abc')` devuelve NaN, y NaN pasado a `.gte()` no
 * filtra — hace que la consulta no devuelva NADA. Es decir: `?beds=abc`,
 * `?minPrice=abc` o `?maxPrice=0` respondían 200 con "no hay propiedades", que es
 * la peor clase de fallo: no un error visible, sino una mentira sobre el
 * catálogo. Un parámetro que no se puede leer se ignora, que es lo que el
 * usuario espera.
 *
 * `null` tiene además significado propio en `maxPrice`: "sin tope".
 */
function leerNumero(valor: string | undefined): number | null {
  if (valor === undefined || valor.trim() === '') return null;
  const n = Number.parseInt(valor, 10);
  return Number.isFinite(n) ? n : null;
}

/*
 * Home — Folio y Sello.
 *
 * Cambio de orden respecto de la versión anterior: antes el proceso ("Cómo
 * funciona") iba antes de cualquier propiedad, así que el visitante leía cómo
 * funciona el sitio antes de ver una sola casa. Ahora la evidencia manda — la
 * selección, después el catálogo — y el proceso cierra la página como prueba de
 * cómo se trabaja, no como introducción.
 *
 * La lógica de filtrado contra Supabase queda intacta.
 */

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    /** Slug de categoría (definida por el admin), no un nombre escrito a mano. */
    categoria?: string;
    operation?: string;
    beds?: string;
    baths?: string;
  }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { page, location, minPrice, maxPrice, categoria, operation, beds, baths } =
    await searchParams;

  const paginaPedida = leerNumero(page);
  const currentPage = paginaPedida && paginaPedida > 0 ? paginaPedida : 1;
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const filtroMin = leerNumero(minPrice);
  const filtroMax = leerNumero(maxPrice);
  const filtroBeds = leerNumero(beds);
  const filtroBaths = leerNumero(baths);

  const supabase = await createClient();

  /*
   * Categorías definidas por el admin, en su orden. Alimentan el filtro público:
   * antes esta lista estaba escrita en el código y ya se había desincronizado con
   * el catálogo real.
   */
  const categorias = await getCategoriasActivas();

  /*
   * El slug de la URL se resuelve a la categoría real. Si no existe o está
   * oculta, el filtro se ignora en lugar de devolver un catálogo vacío: un
   * enlace viejo no debería vaciar la página.
   */
  const categoriaActiva = categoria
    ? categorias.find((c) => c.slug === categoria) ?? null
    : null;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  if (location) {
    query = query.or(`location.ilike.%${location}%,title.ilike.%${location}%`);
  }
  if (filtroMin !== null && filtroMin > 0) {
    query = query.gte('price', filtroMin);
  }
  /* `maxPrice=0` no es "gratis": es "el usuario borró el tope". Se ignora. */
  if (filtroMax !== null && filtroMax > 0) {
    query = query.lte('price', filtroMax);
  }
  /*
   * Ahora sí es un filtro: compara contra `category_id`, que es un dato. Antes se
   * aproximaba con `title.ilike` —buscaba la palabra en el título— y por eso
   * dependía de cómo alguien titulaba la propiedad.
   */
  if (categoriaActiva) {
    query = query.eq('category_id', categoriaActiva.id);
  }
  /*
   * Operación (venta/alquiler). Es `properties.type`, un campo real del modelo;
   * no confundir con la categoría, que ahora es su propia columna.
   */
  if (operation && (operation === 'sale' || operation === 'rent')) {
    query = query.eq('type', operation);
  }
  if (filtroBeds !== null && filtroBeds > 0) {
    query = query.gte('beds', filtroBeds);
  }
  if (filtroBaths !== null && filtroBaths > 0) {
    query = query.gte('baths', filtroBaths);
  }

  const { data: properties, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  /* Conteo real de alquileres: alimenta una línea de catálogo en el primer
     viewport. Es un dato que el sistema puede calcular, así que se muestra. */
  const { count: totalAlquiler } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('type', 'rent');

  const isFilterActive = !!(
    location ||
    minPrice ||
    maxPrice ||
    categoriaActiva ||
    operation ||
    beds ||
    baths
  );

  return (
    <>
      <Hero
        dict={content.hero}
        totalResults={count ?? 0}
        totalAlquiler={totalAlquiler ?? 0}
      />
      <main className="mx-auto max-w-tomo px-4 sm:px-6 lg:px-10">
        {!isFilterActive && <FeaturedCollection />}
        <NewInMarket
          properties={(properties ?? []) as unknown as Property[]}
          totalCount={count ?? 0}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
        />
        <HowItWorks />
      </main>
    </>
  );
}
