import { createClient } from '@/lib/supabase/server';

/*
 * Categorías de propiedad.
 *
 * Antes no existían como dato: el filtro buscaba la categoría dentro del TÍTULO
 * y la lista vivía escrita a mano en el código. Ahora son filas de
 * `property_categories`, creadas y ordenadas desde el panel.
 *
 * REQUISITO: necesita la migración
 * `supabase/migrations/20260914_categorias_de_propiedad.sql` corrida en Supabase.
 * Sin ella, la tabla no existe y estas funciones devuelven vacío (el sitio sigue
 * funcionando, simplemente sin filtro de categoría).
 *
 * El slug es lo que viaja en la URL (`?categoria=villa`): es estable y legible,
 * y sobrevive a que alguien renombre la categoría — cosa que el nombre no haría.
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

/** Convierte un nombre en slug: sin acentos, sin espacios, en minúsculas. */
export function aSlug(nombre: string): string {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Categorías activas, en el orden que definió el admin.
 * Es lo que alimenta el filtro público.
 */
export async function getCategoriasActivas(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('property_categories')
    .select('id, name, slug, sort_order, is_active')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  return (data as Category[] | null) ?? [];
}

/** Todas las categorías, activas e inactivas. Solo para el panel. */
export async function getCategoriasTodas(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('property_categories')
    .select('id, name, slug, sort_order, is_active')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  return (data as Category[] | null) ?? [];
}

/**
 * Resuelve un slug de la URL a su categoría.
 * Devuelve null si el slug no corresponde a ninguna categoría activa, así el
 * filtro se puede ignorar en lugar de devolver un catálogo vacío.
 */
export async function getCategoriaPorSlug(
  slug: string,
): Promise<Category | null> {
  if (!slug) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from('property_categories')
    .select('id, name, slug, sort_order, is_active')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  return (data as Category | null) ?? null;
}
