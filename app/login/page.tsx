"use client";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Rule } from "@/components/ui/primitives";

/*
 * Login — Folio y Sello.
 * Lo que cambió: se fue el icono en caja carbón, el `shadow-[0_8px_30px_…]` y los
 * campos con radio grande y ring dorado. Ahora es la hoja de acceso del tomo:
 * membrillo, reglas y una sola acción primaria.
 * La lógica de autenticación no se tocó.
 */

const CAMPO =
  "w-full border border-rule-fuerte bg-hoja-alta px-4 py-3 text-cuerpo text-tinta placeholder:text-tinta-tenue/70 transition-colors focus:border-tinta focus:outline-none";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
      setLoading(false);
    } else if (data.user) {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      if (roleData?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-tomo items-center px-4 pt-32 pb-20 sm:px-6 lg:px-10">
      <div className="w-full max-w-md">
        {/* Marca: identifica el sitio, no es el titular de la página */}
        <div className="flex items-baseline justify-between gap-4">
          <Link
            href="/"
            className="font-display text-marca tracking-[-0.015em] text-tinta"
          >
            NOMOS
          </Link>
          <span className="indicador">Acceso</span>
        </div>
        <Rule weight="fuerte" className="mt-4" />

        <h1 className="mt-8 font-display text-titulo font-normal text-tinta">
          Entrá a tu cuenta
        </h1>
        <p className="mt-4 max-w-[42ch] text-menudo text-tinta-tenue">
          Los agentes administran el catálogo y los usuarios desde acá.
        </p>

        <form onSubmit={handleEmailLogin} className="mt-9 space-y-6">
          <div>
            <label htmlFor="email" className="indicador mb-2 block">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@ejemplo.com"
              className={CAMPO}
            />
          </div>

          <div>
            <label htmlFor="password" className="indicador mb-2 block">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${CAMPO} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-tinta-tenue transition-colors hover:text-tinta"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="border border-laca/30 bg-laca-tenue px-4 py-3 text-menudo text-laca"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-14 w-full items-center justify-center border border-tinta bg-tinta text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover disabled:opacity-50"
          >
            {loading ? "Iniciando sesión…" : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </main>
  );
}
