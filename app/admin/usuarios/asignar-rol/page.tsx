"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserRole } from "../actions";
import { toast } from "sonner";
import Link from "next/link";
import { FiArrowLeft, FiSave } from "react-icons/fi";

/*
 * Admin · Asignar rol — Folio y Sello, modo Operate.
 * La lógica no se toca. Cambia el envoltorio: los campos usan el mismo
 * tratamiento que el resto del sistema (borde de 1px que pasa a tinta en foco) y
 * la etiqueta se declara con la categoría serial del mundo.
 */

const CAMPO =
  "w-full border border-rule-fuerte bg-hoja-alta px-4 py-2.5 text-menudo text-tinta placeholder:text-tinta-tenue/70 transition-colors focus:border-tinta focus:outline-none";

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createUserRole(formData);
      toast.success("Rol asignado correctamente");
      router.push("/admin/usuarios");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear usuario";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <nav aria-label="Volver">
        <Link
          href="/admin/usuarios"
          className="group inline-flex items-center gap-2 text-menudo text-tinta-tenue transition-colors hover:text-tinta"
        >
          <FiArrowLeft
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          Volver al directorio
        </Link>
      </nav>

      <header className="mt-8 border-t border-rule pt-5">
        <span className="indicador text-tinta">Administración · Usuarios</span>
        <h1 className="mt-3 font-display text-titulo font-normal text-tinta">
          Asignar rol a usuario
        </h1>
        <p className="mt-3 max-w-[52ch] text-menudo text-tinta-tenue">
          Ingresá el email de un usuario ya registrado para asignarle un rol.
        </p>
      </header>

      <div className="hoja mt-10 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label htmlFor="email" className="indicador mb-2 block">
              Email del usuario
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="usuario@ejemplo.com"
              className={CAMPO}
            />
            <p className="mt-2 text-menudo text-tinta-tenue">
              El usuario debe haberse registrado previamente en la plataforma.
            </p>
          </div>

          <div>
            <label htmlFor="role" className="indicador mb-2 block">
              Rol
            </label>
            <select
              id="role"
              name="role"
              className={`${CAMPO} cursor-pointer`}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-rule pt-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center gap-2 border border-tinta bg-tinta px-6 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover disabled:opacity-50"
            >
              {loading ? (
                <span aria-hidden="true" className="animate-spin">
                  ⟳
                </span>
              ) : (
                <FiSave aria-hidden="true" />
              )}
              {loading ? "Asignando…" : "Asignar rol"}
            </button>
            <Link
              href="/admin/usuarios"
              className="border-b border-transparent pb-1 text-menudo text-tinta-tenue transition-colors hover:border-tinta hover:text-tinta"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
