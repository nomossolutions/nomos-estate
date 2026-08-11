"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserRole } from "../actions";
import { toast } from "sonner";
import Link from "next/link";
import { FiArrowLeft, FiSave } from "react-icons/fi";

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
      router.push("/admin/users");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear usuario";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grow max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <div className="mb-6">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal transition-colors"
        >
          <FiArrowLeft className="text-base" />
          Volver al directorio
        </Link>
      </div>

      <div className="bg-white border border-charcoal/10 p-8">
        <h1 className="text-2xl font-bold text-charcoal mb-2">
          Asignar Rol a Usuario
        </h1>
        <p className="text-sm text-charcoal/60 mb-8">
          Ingresa el email de un usuario existente para asignarle un rol.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-charcoal mb-1.5"
            >
              Email del usuario
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="usuario@ejemplo.com"
              className="w-full border border-charcoal/10 rounded-lg px-4 py-2.5 text-sm text-charcoal placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
            />
            <p className="mt-1.5 text-xs text-charcoal/50">
              El usuario debe haberse registrado previamente en la plataforma.
            </p>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-charcoal mb-1.5"
            >
              Rol
            </label>
            <select
              id="role"
              name="role"
              className="w-full border border-charcoal/10 rounded-lg px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition cursor-pointer"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/admin/users"
              className="px-6 py-2.5 rounded-lg border border-charcoal/10 text-charcoal font-medium hover:bg-surface-container-low transition-colors text-sm"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-gold hover:bg-gold/90 text-white font-medium shadow-md transition-colors disabled:opacity-50 flex items-center gap-2 text-sm cursor-pointer"
            >
              {loading ? (
                <span className="animate-spin">⟳</span>
              ) : (
                <FiSave className="text-sm" />
              )}
              Asignar Rol
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
