'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { aSlug } from '@/lib/categories';

/*
 * Acciones de categorías — Sala Blanca, modo Operate.
 *
 * Todas verifican el rol de administrador del lado del servidor. No alcanza con
 * que el enlace esté oculto en la interfaz: una acción de servidor es un
 * endpoint, y se puede llamar sin pasar por la pantalla.
 *
 * Nota sobre el borrado: `properties.category_id` está declarado con
 * `on delete restrict`, así que la base rechaza borrar una categoría que está en
 * uso. Eso es correcto —no se pierde la clasificación en silencio— pero el
 * mensaje crudo de Postgres no sirve al usuario, así que se traduce a una
 * indicación concreta.
 */

export interface ResultadoAccion {
  ok: boolean;
  mensaje: string;
}

async function exigirAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');

  const { data: rol } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!rol || rol.role !== 'admin') throw new Error('No autorizado');
  return supabase;
}

/** Próximo `sort_order`: al final de la lista. */
async function proximoOrden(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<number> {
  const { data } = await supabase
    .from('property_categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();
  return ((data?.sort_order as number | undefined) ?? 0) + 10;
}

export async function crearCategoria(
  _previo: ResultadoAccion | null,
  formData: FormData,
): Promise<ResultadoAccion> {
  const nombre = String(formData.get('name') ?? '').trim();
  if (!nombre) return { ok: false, mensaje: 'La categoría necesita un nombre.' };

  const slug = aSlug(nombre);
  if (!slug) {
    return {
      ok: false,
      mensaje: 'El nombre tiene que tener al menos una letra o un número.',
    };
  }

  try {
    const supabase = await exigirAdmin();

    const { data: existente } = await supabase
      .from('property_categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (existente) {
      return { ok: false, mensaje: `Ya existe una categoría con el slug "${slug}".` };
    }

    const { error } = await supabase.from('property_categories').insert({
      name: nombre,
      slug,
      sort_order: await proximoOrden(supabase),
    });

    if (error) return { ok: false, mensaje: `No se pudo crear: ${error.message}` };

    revalidatePath('/admin/categorias');
    revalidatePath('/');
    return { ok: true, mensaje: `Categoría "${nombre}" creada.` };
  } catch (e) {
    return { ok: false, mensaje: e instanceof Error ? e.message : 'Error inesperado.' };
  }
}

export async function renombrarCategoria(
  id: string,
  nombre: string,
): Promise<ResultadoAccion> {
  const limpio = nombre.trim();
  if (!limpio) return { ok: false, mensaje: 'El nombre no puede quedar vacío.' };

  try {
    const supabase = await exigirAdmin();
    /*
     * Se actualiza el nombre y NO el slug: el slug está en URLs ya compartidas y
     * en el filtro activo. Cambiarlo rompería enlaces vivos, así que renombrar no
     * lo toca.
     */
    const { error } = await supabase
      .from('property_categories')
      .update({ name: limpio })
      .eq('id', id);

    if (error) return { ok: false, mensaje: `No se pudo renombrar: ${error.message}` };

    revalidatePath('/admin/categorias');
    revalidatePath('/');
    return { ok: true, mensaje: 'Nombre actualizado.' };
  } catch (e) {
    return { ok: false, mensaje: e instanceof Error ? e.message : 'Error inesperado.' };
  }
}

export async function alternarCategoria(
  id: string,
  activa: boolean,
): Promise<ResultadoAccion> {
  try {
    const supabase = await exigirAdmin();
    const { error } = await supabase
      .from('property_categories')
      .update({ is_active: !activa })
      .eq('id', id);

    if (error) return { ok: false, mensaje: `No se pudo actualizar: ${error.message}` };

    revalidatePath('/admin/categorias');
    revalidatePath('/');
    return {
      ok: true,
      mensaje: activa
        ? 'Categoría retirada del filtro público.'
        : 'Categoría publicada en el filtro.',
    };
  } catch (e) {
    return { ok: false, mensaje: e instanceof Error ? e.message : 'Error inesperado.' };
  }
}

export async function moverCategoria(
  id: string,
  direccion: 'subir' | 'bajar',
): Promise<ResultadoAccion> {
  try {
    const supabase = await exigirAdmin();

    const { data } = await supabase
      .from('property_categories')
      .select('id, name, sort_order')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    const lista = (data ?? []) as { id: string; name: string; sort_order: number }[];
    const i = lista.findIndex((c) => c.id === id);
    if (i < 0) return { ok: false, mensaje: 'No encontré esa categoría.' };

    const j = direccion === 'subir' ? i - 1 : i + 1;
    if (j < 0 || j >= lista.length) {
      return { ok: false, mensaje: 'Ya está en el extremo de la lista.' };
    }

    /*
     * Se intercambian los valores de orden de las dos categorías vecinas. Se
     * escriben `sort_order` explícitos en vez de confiar en un índice para que el
     * orden no dependa de cuántos huecos haya quedado en la numeración.
     */
    const a = lista[i];
    const b = lista[j];
    const ordenA = a.sort_order;
    const ordenB = b.sort_order;

    const r1 = await supabase
      .from('property_categories')
      .update({ sort_order: ordenB })
      .eq('id', a.id);
    const r2 = await supabase
      .from('property_categories')
      .update({ sort_order: ordenA })
      .eq('id', b.id);

    if (r1.error || r2.error) {
      return { ok: false, mensaje: 'No se pudo reordenar.' };
    }

    revalidatePath('/admin/categorias');
    revalidatePath('/');
    return { ok: true, mensaje: 'Orden actualizado.' };
  } catch (e) {
    return { ok: false, mensaje: e instanceof Error ? e.message : 'Error inesperado.' };
  }
}

export async function eliminarCategoria(id: string): Promise<ResultadoAccion> {
  try {
    const supabase = await exigirAdmin();

    /* Cuántas propiedades la usan: decide si se puede borrar o solo retirar. */
    const { count } = await supabase
      .from('properties')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id);

    if (count && count > 0) {
      return {
        ok: false,
        mensaje: `${count} propiedad${count === 1 ? '' : 'es'} usan esta categoría. Reasignalas antes de borrarla, o retirala del filtro con "Ocultar".`,
      };
    }

    const { error } = await supabase.from('property_categories').delete().eq('id', id);
    if (error) return { ok: false, mensaje: `No se pudo borrar: ${error.message}` };

    revalidatePath('/admin/categorias');
    revalidatePath('/');
    return { ok: true, mensaje: 'Categoría borrada.' };
  } catch (e) {
    return { ok: false, mensaje: e instanceof Error ? e.message : 'Error inesperado.' };
  }
}
