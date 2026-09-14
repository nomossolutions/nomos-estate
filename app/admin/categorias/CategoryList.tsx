'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { FiTrash2, FiChevronUp, FiChevronDown, FiEdit2, FiEyeOff, FiEye } from 'react-icons/fi';
import {
  eliminarCategoria,
  moverCategoria,
  renombrarCategoria,
  alternarCategoria,
} from '@/app/admin/categorias/actions';
import type { Category } from '@/lib/categories';

/*
 * Lista de categorías con sus acciones.
 *
 * Cada acción es un `useTransition`: mientras corre, el botón que la disparó queda
 * deshabilitado y el resto de la fila sigue operable. Nada de estado global ni de
 * recargar la página a mano — las acciones ya hacen `revalidatePath`.
 *
 * Los conteos de uso llegan calculados del servidor, no se piden acá.
 */

export interface CategoriaConUso extends Category {
  uso: number;
}

interface Props {
  categorias: CategoriaConUso[];
}

export default function CategoryList({ categorias }: Props) {
  const [pendiente, startTransition] = useTransition();
  const [enEdicion, setEnEdicion] = useState<string | null>(null);
  const [borrador, setBorrador] = useState('');

  const correr = (fn: () => Promise<{ ok: boolean; mensaje: string }>) => {
    startTransition(async () => {
      const r = await fn();
      if (r.ok) toast.success(r.mensaje);
      else toast.error(r.mensaje);
    });
  };

  if (categorias.length === 0) {
    return (
      <div className="hoja p-10">
        <p className="font-display text-folio text-tinta">
          Todavía no hay categorías.
        </p>
        <p className="mt-3 max-w-[52ch] text-menudo text-tinta-tenue">
          Creá la primera con el formulario de arriba. Hasta entonces, el filtro
          del sitio no ofrece categorías.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="hidden grid-cols-12 gap-4 border-b border-tinta pb-3 md:grid">
        <span className="indicador col-span-1">Orden</span>
        <span className="indicador col-span-4">Categoría</span>
        <span className="indicador col-span-3">Identificador</span>
        <span className="indicador col-span-1">Propiedades</span>
        <span className="indicador col-span-3 text-right">Acciones</span>
      </div>

      {categorias.map((c, i) => (
        <div
          key={c.id}
          className="grid grid-cols-1 items-center gap-4 border-b border-rule py-4 md:grid-cols-12"
        >
          {/* Orden */}
          <div className="col-span-1 flex items-center gap-1">
            <button
              type="button"
              disabled={pendiente || i === 0}
              onClick={() => correr(() => moverCategoria(c.id, 'subir'))}
              aria-label={`Subir ${c.name}`}
              className="flex h-9 w-9 items-center justify-center border border-transparent text-tinta-tenue transition-colors hover:border-rule-fuerte hover:text-tinta disabled:opacity-30"
            >
              <FiChevronUp />
            </button>
            <button
              type="button"
              disabled={pendiente || i === categorias.length - 1}
              onClick={() => correr(() => moverCategoria(c.id, 'bajar'))}
              aria-label={`Bajar ${c.name}`}
              className="flex h-9 w-9 items-center justify-center border border-transparent text-tinta-tenue transition-colors hover:border-rule-fuerte hover:text-tinta disabled:opacity-30"
            >
              <FiChevronDown />
            </button>
          </div>

          {/* Nombre, editable en línea */}
          <div className="col-span-4">
            {enEdicion === c.id ? (
              <div className="flex items-center gap-2">
                <input
                  value={borrador}
                  onChange={(e) => setBorrador(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      correr(() => renombrarCategoria(c.id, borrador));
                      setEnEdicion(null);
                    }
                    if (e.key === 'Escape') setEnEdicion(null);
                  }}
                  aria-label={`Nuevo nombre para ${c.name}`}
                  className="w-full border border-rule-fuerte bg-hoja-alta px-3 py-2 text-menudo text-tinta focus:border-tinta focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    correr(() => renombrarCategoria(c.id, borrador));
                    setEnEdicion(null);
                  }}
                  className="h-10 shrink-0 border border-tinta bg-tinta px-3 text-menudo text-hoja"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEnEdicion(null)}
                  className="h-10 shrink-0 border border-rule-fuerte px-3 text-menudo text-tinta"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="font-display text-folio font-normal text-tinta">
                  {c.name}
                </span>
                {!c.is_active && <span className="sello sello--reservado">Oculta</span>}
              </div>
            )}
          </div>

          {/* Slug: se muestra porque es lo que viaja en la URL */}
          <div className="col-span-3">
            <code className="indicador tabular text-tinta-tenue">
              /?categoria={c.slug}
            </code>
          </div>

          {/* Uso */}
          <div className="col-span-1">
            <span
              className={`indicador tabular ${c.uso === 0 ? 'text-tinta-tenue' : 'text-tinta'}`}
            >
              {c.uso}
            </span>
          </div>

          {/* Acciones */}
          <div className="col-span-3 flex items-center justify-end gap-1">
            <button
              type="button"
              disabled={pendiente}
              onClick={() => {
                setEnEdicion(c.id);
                setBorrador(c.name);
              }}
              aria-label={`Renombrar ${c.name}`}
              title="Renombrar"
              className="flex h-10 w-10 items-center justify-center border border-transparent text-tinta-tenue transition-colors hover:border-rule-fuerte hover:text-tinta disabled:opacity-30"
            >
              <FiEdit2 />
            </button>
            <button
              type="button"
              disabled={pendiente}
              onClick={() => correr(() => alternarCategoria(c.id, c.is_active))}
              aria-label={c.is_active ? `Ocultar ${c.name}` : `Publicar ${c.name}`}
              title={c.is_active ? 'Ocultar del filtro' : 'Publicar en el filtro'}
              className="flex h-10 w-10 items-center justify-center border border-transparent text-tinta-tenue transition-colors hover:border-rule-fuerte hover:text-tinta disabled:opacity-30"
            >
              {c.is_active ? <FiEyeOff /> : <FiEye />}
            </button>
            <button
              type="button"
              disabled={pendiente}
              onClick={() => correr(() => eliminarCategoria(c.id))}
              aria-label={`Borrar ${c.name}`}
              title="Borrar"
              className="flex h-10 w-10 items-center justify-center border border-transparent text-tinta-tenue transition-colors hover:border-laca/40 hover:text-laca disabled:opacity-30"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
