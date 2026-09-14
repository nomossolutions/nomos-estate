import Link from "next/link";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiLinkedin,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { Rule } from "./ui/primitives";
import content from "@/lib/i18n";

/*
 * Footer — Folio y Sello.
 *
 * Lo que cambió: era un bloque carbón con círculos sociales que se rellenaban de
 * dorado al hover. Ahora se lee como el colofón de un tomo: la marca, tres
 * columnas de referencia y una línea de cierre, todo separado por reglas.
 *
 * El copy de contacto (dirección, teléfono, correo) queda tal cual: es contenido
 * factual y no me corresponde reemplazarlo.
 */

const Footer = () => {
  const f = content.footer;

  const redes = [
    { icon: <FiInstagram />, href: "#", label: "Instagram" },
    { icon: <FiFacebook />, href: "#", label: "Facebook" },
    { icon: <FiTwitter />, href: "#", label: "Twitter" },
    { icon: <FiLinkedin />, href: "#", label: "LinkedIn" },
  ];

  const navegacion = [
    { label: "Inicio", href: "/" },
    { label: "Propiedades", href: "/#propiedades" },
    { label: "Sobre Nosotros", href: "/about" },
    { label: "Iniciar Sesión", href: "/login" },
  ];

  const contacto = [
    {
      icon: <FiMapPin />,
      text: "123 Avenue Design, Miami, FL",
      href: undefined,
    },
    {
      icon: <FiPhone />,
      text: "+1 (305) 555-1234",
      href: "tel:+13055551234",
    },
    {
      icon: <FiMail />,
      text: "hola@nomosestate.com",
      href: "mailto:hola@nomosestate.com",
    },
  ];

  return (
    <footer className="mt-16 border-t-2 border-tinta bg-tinta text-hoja">
      <div className="mx-auto max-w-tomo px-4 py-16 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          {/* Colofón */}
          <div className="md:col-span-5">
            <span className="font-display text-colofon tracking-[-0.015em]">NOMOS</span>
            <p className="mt-5 max-w-[42ch] text-menudo leading-relaxed text-hoja/60">
              {f.description}
            </p>
            <div className="mt-7 flex gap-2">
              {redes.map((red) => (
                <a
                  key={red.label}
                  href={red.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={red.label}
                  className="flex h-10 w-10 items-center justify-center border border-hoja/25 text-hoja/70 transition-colors hover:border-hoja hover:text-hoja"
                >
                  {red.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Referencia */}
          <nav className="md:col-span-3 md:col-start-7" aria-label="Navegación">
            <h2 className="indicador text-hoja/50">Navegación</h2>
            <ul className="mt-5 space-y-3">
              {navegacion.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="border-b border-transparent text-menudo text-hoja/70 transition-colors hover:border-hoja/40 hover:text-hoja"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="indicador text-hoja/50">Contacto</h2>
            <ul className="mt-5 space-y-4">
              {contacto.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-0.5 text-hoja/40">
                    {item.icon}
                  </span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="border-b border-transparent text-menudo text-hoja/70 transition-colors hover:border-hoja/40 hover:text-hoja"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-menudo text-hoja/70">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Rule className="mt-14 bg-hoja/15" />
        <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="indicador text-hoja/45">
            © {new Date().getFullYear()} Nomos Estate. Todos los derechos
            reservados.
          </p>
          <p className="indicador text-hoja/45">
            Desarrollado por{" "}
            <a
              href="https://www.nomosdigital.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-transparent text-hoja/70 transition-colors hover:border-hoja/40"
            >
              Nomos Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
