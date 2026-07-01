import { FiHome, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Link from 'next/link';
import content from '@/lib/i18n';

const Footer = () => {
  const f = content.footer;

  return (
    <footer className="bg-nordic mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <FiHome className="text-white text-lg" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white">
                NomosEstate
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              {f.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-5">
              {f.quick_links}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#hero" className="text-white/70 hover:text-mosque text-sm transition-colors">
                  {content.navbar.home}
                </Link>
              </li>
              <li>
                <Link href="/#properties" className="text-white/70 hover:text-mosque text-sm transition-colors">
                  {content.navbar.properties}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-mosque text-sm transition-colors">
                  {f.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-5">
              {f.contact}
            </h4>
            <ul className="space-y-3">
              <li className="text-white/50 text-sm flex items-center gap-2">
                <FiMail className="text-mosque/60 text-base" />
                hello@nomosestate.com
              </li>
              <li className="text-white/50 text-sm flex items-center gap-2">
                <FiPhone className="text-mosque/60 text-base" />
                +54 11 5555-1234
              </li>
              <li className="text-white/50 text-sm flex items-center gap-2">
                <FiMapPin className="text-mosque/60 text-base" />
                Tucumán, Argentina
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-white/40 text-xs">
            {f.rights} — Desarrollado por{' '}
            <a
              href="https://www.nomosdigital.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-mosque transition-colors"
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
