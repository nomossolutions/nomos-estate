import Link from 'next/link';
import { FiInstagram, FiFacebook, FiTwitter, FiLinkedin, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import content from '@/lib/i18n';

const Footer = () => {
  const f = content.footer;

  const socialLinks = [
    { icon: <FiInstagram className="text-lg" />, href: '#', label: 'Instagram' },
    { icon: <FiFacebook className="text-lg" />, href: '#', label: 'Facebook' },
    { icon: <FiTwitter className="text-lg" />, href: '#', label: 'Twitter' },
    { icon: <FiLinkedin className="text-lg" />, href: '#', label: 'LinkedIn' },
  ];

  const navigationLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Propiedades', href: '/#properties' },
    { label: 'Sobre Nosotros', href: '/about' },
    { label: 'Iniciar Sesión', href: '/login' },
  ];

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tighter font-display">
                NOMOS
              </span>
            </Link>
            <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-xs">
              {f.description}
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-gold hover:text-white transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-5">
              Navegación
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-5">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-gold mt-0.5 shrink-0" />
                <span className="text-white/60 text-sm">
                  123 Avenue Design, Miami, FL
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-gold shrink-0" />
                <a href="tel:+13055551234" className="text-white/60 text-sm hover:text-gold transition-colors">
                  +1 (305) 555-1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-gold shrink-0" />
                <a href="mailto:hola@nomosestate.com" className="text-white/60 text-sm hover:text-gold transition-colors">
                  hola@nomosestate.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-white/40 text-xs">
            © {new Date().getFullYear()} Nomos Estate. Todos los derechos reservados.
          </div>
          <div className="text-white/40 text-xs">
            Desarrollado por{' '}
            <a
              href="https://www.nomosdigital.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/70 transition-colors"
            >
              Nomos Digital
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
