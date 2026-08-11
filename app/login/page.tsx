"use client";

import { FiHome, FiEye, FiEyeOff } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
    <div className="bg-clear-day min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <main className="w-full max-w-md z-10 flex flex-col items-center">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-charcoal rounded mb-4 text-white">
            <FiHome className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal mb-1.5">
            Bienvenido a NomosEstate
          </h1>
          <p className="text-text-muted text-sm">
            Descubre propiedades exclusivas alrededor del mundo.
          </p>
        </div>

        <div className="bg-white w-full  p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-muted mb-1.5"
              >
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
                className="w-full border border-charcoal/10 rounded-lg px-3.5 py-3 text-sm text-charcoal placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-muted mb-1.5"
              >
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
                  className="w-full border border-charcoal/10 rounded-lg px-3.5 py-3 pr-11 text-sm text-charcoal placeholder-text-muted/50 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-charcoal transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none rounded cursor-pointer"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-burgundy bg-burgundy/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal hover:bg-charcoal-hover disabled:opacity-60 text-white font-semibold text-sm rounded-lg py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold/40 cursor-pointer"
            >
              {loading ? "Iniciando sesión…" : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
