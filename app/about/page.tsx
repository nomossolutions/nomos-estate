import Link from 'next/link';
import { FiHome, FiTarget, FiEye, FiHeart, FiTrendingUp, FiArrowRight, FiAward } from 'react-icons/fi';
import content from '@/lib/i18n';

export const metadata = {
  title: 'Sobre Nosotros | NomosEstate',
  description: 'Conoce más sobre NomosEstate, nuestra misión, visión y el equipo que hace posible la mejor experiencia inmobiliaria.',
};

const valueIcons = [FiAward, FiTrendingUp, FiEye, FiHeart];

export default function AboutPage() {
  const t = content.about;

  return (
    <main className="bg-clear-day">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-mosque/[0.03] blur-3xl"></div>
          <div className="absolute top-[20%] right-[5%] w-[300px] h-[300px] rounded-full bg-nordic/[0.02] blur-2xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-nordic rounded-2xl mb-8 text-white">
            <FiHome className="text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-nordic leading-tight font-display mb-6">
            {t.title}
          </h1>
          <p className="text-lg text-nordic-muted max-w-2xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-nordic/5">
              <div className="w-12 h-12 rounded-full bg-mosque/10 flex items-center justify-center text-mosque mb-5">
                <FiTarget className="text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-nordic mb-3 font-display">{t.mission_title}</h2>
              <p className="text-nordic-muted leading-relaxed">{t.mission_text}</p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-nordic/5">
              <div className="w-12 h-12 rounded-full bg-mosque/10 flex items-center justify-center text-mosque mb-5">
                <FiEye className="text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-nordic mb-3 font-display">{t.vision_title}</h2>
              <p className="text-nordic-muted leading-relaxed">{t.vision_text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light text-nordic font-display">{t.values_title}</h2>
            <div className="w-12 h-0.5 bg-mosque/50 mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.map((value, idx) => {
              const Icon = valueIcons[idx];
              return (
                <div key={value.title} className="bg-white p-6 rounded-xl shadow-sm border border-nordic/5 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-hint-of-green flex items-center justify-center text-mosque mx-auto mb-4">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="text-base font-semibold text-nordic mb-2">{value.title}</h3>
                  <p className="text-sm text-nordic-muted leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-nordic/5 text-center">
            <div className="w-12 h-12 rounded-full bg-nordic/10 flex items-center justify-center text-nordic mx-auto mb-5">
              <FiHeart className="text-xl" />
            </div>
            <h2 className="text-xl font-semibold text-nordic mb-3 font-display">{t.team_title}</h2>
            <p className="text-nordic-muted leading-relaxed max-w-2xl mx-auto">{t.team_text}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-nordic rounded-2xl p-10 md:p-14 text-center">
            <h2 className="text-2xl md:text-3xl font-light text-white font-display mb-4">{t.cta_title}</h2>
            <p className="text-white/60 text-sm max-w-xl mx-auto mb-8">{t.cta_text}</p>
            <Link
              href="/#properties"
              className="inline-flex items-center gap-2 bg-mosque hover:bg-mosque/90 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-black/10"
            >
              {t.cta_button}
              <FiArrowRight className="text-base" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
