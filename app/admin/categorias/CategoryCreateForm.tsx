'use client';

import { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { FiPlus } from 'react-icons/fi';
import { crearCategoria, type ResultadoAccion } from '@/app/admin/categorias/actions';

/*
 * Alta de categorías.
 *
 * Usa `useActionState`, así que el estado del formulario lo devuelve la acción de
 * servidor y el aviso de error no depende de que el cliente lo interprete. No se
 * usó `useEffect` para sincronizar nada: el formulario se limpia con una ref
 * cuando la acción confirma, que es un evento, no un render.
 */

const CAMPO =
  'w-full border border-rule-fuerte bg-hoja-alta px-4 py-2.5 text-menudo text-tinta placeholder:text-tinta-tenue/70 transition-colors focus:border-tinta focus:outline-none';

export default function CategoryCreateForm() {
  const [estado, accion, pendiente] = useActionState<ResultadoAccion | null, FormData>(
    crearCategoria,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const ultimo = useRef<ResultadoAccion | null>(null);

  useEffect(() => {
    if (!estado || estado === ultimo.current) return;
    ultimo.current = estado;
    if (estado.ok) {
      toast.success(estado.mensaje);
      formRef.current?.reset();
    } else {
      toast.error(estado.mensaje);
    }
  }, [estado]);

  return (
    <form ref={formRef} action={accion} className="hoja p-6">
      <label htmlFor="name" className="indicador mb-2 block">
        Nombre de la categoría
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={40}
          placeholder="Ej.: Casa de campo"
          className={CAMPO}
        />
        <button
          type="submit"
          disabled={pendiente}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 border border-tinta bg-tinta px-5 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover disabled:opacity-50"
        >
          <FiPlus aria-hidden="true" />
          {pendiente ? 'Creando…' : 'Crear categoría'}
        </button>
      </div>
      <p className="mt-3 text-menudo text-tinta-tenue">
        Aparece en el filtro del sitio apenas se crea. El identificador de la URL
        se genera solo a partir del nombre.
      </p>
    </form>
  );
}
