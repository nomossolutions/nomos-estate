import { createClient } from '@/lib/supabase/server';
import { getCategoriasTodas } from '@/lib/categories';
import CategoryCreateForm from './CategoryCreateForm';
import CategoryList, { type CategoriaConUso } from './CategoryList';

/*
 * Admin · Categorías — Sala Blanca, modo Operate.
 *
 * La pantalla donde el admin define las categorías que después ofrece el filtro
 * público. Antes esto no existía: la lista vivía escrita en el código y el
 * "tipo de propiedad" solo distinguía venta de alquiler.
 *
 * REQUISITO: la migración `supabase/migrations/20260914_categorias_de_propiedad.sql`
 * tiene que estar corrida. Si no lo está, la tabla no existe, la lista llega
 * vacía y esta pantalla muestra el estado vacío con el formulario — no se rompe.
 */

export const metadata = {
  title: 'Categorías | Nomos Estate',
};

export default async function AdminCategoriasPage() {
  const categorias = await getCategoriasTodas();

  /*
   * Conteo de uso. Se resuelve con UNA consulta de todas las propiedades y se
   * agrupa en memoria: pedir un count por categoría sería una consulta por fila,
   * que con pocas categorías no se nota pero es el patrón que no escala.
   */
  const supabase = await createClient();
  const { data: propiedades } = await supabase
    .from('properties')
    .select('category_id');

  const uso = new Map<string, number>();
  for (const p of (propiedades ?? []) as { category_id: string | null }[]) {
    if (p.category_id) uso.set(p.category_id, (uso.get(p.category_id) ?? 0) + 1);
  }

  const conUso: CategoriaConUso[] = categorias.map((c) => ({
    ...c,
    uso: uso.get(c.id) ?? 0,
  }));

  const sinCategoria = ((propiedades ?? []) as { category_id: string | null }[]).filter(
    (p) => !p.category_id,
  ).length;

  return (
    <main className="mx-auto w-full max-w-tomo px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <header className="border-t border-rule pt-5">
        <span className="indicador text-tinta">Administración · Categorías</span>
        <h1 className="mt-3 font-display text-titulo font-normal text-tinta">
          Categorías de propiedad
        </h1>
        <p className="mt-3 max-w-[58ch] text-menudo text-tinta-tenue">
          Lo que definas acá es lo que ofrece el filtro del sitio público. El
          orden de esta lista es el orden en que aparecen.
        </p>
      </header>

      {sinCategoria > 0 && (
        <p
          role="status"
          className="mt-8 border border-laton/40 bg-laton-tenue px-4 py-3 text-menudo text-tinta"
        >
          <strong className="font-medium">
            {sinCategoria} propiedad{sinCategoria === 1 ? '' : 'es'} sin categoría.
          </strong>{' '}
          No van a aparecer al filtrar por categoría. Asignalas desde la ficha de
          cada propiedad.
        </p>
      )}

      <div className="mt-10">
        <CategoryCreateForm />
      </div>

      <section className="mt-12" aria-label="Listado de categorías">
        <CategoryList categorias={conUso} />
      </section>
    </main>
  );
}
