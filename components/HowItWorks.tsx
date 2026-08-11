import { FiSearch, FiMessageCircle, FiKey } from "react-icons/fi";

const steps = [
  {
    icon: <FiSearch className="text-2xl" />,
    number: "01",
    title: "Explora",
    description:
      "Descubre propiedades exclusivas seleccionadas para los más exigentes.",
  },
  {
    icon: <FiMessageCircle className="text-2xl" />,
    number: "02",
    title: "Conecta",
    description:
      "Habla con un agente especializado que entiende tus necesidades.",
  },
  {
    icon: <FiKey className="text-2xl" />,
    number: "03",
    title: "Consigue",
    description: "Cierra tu compra con confianza y seguridad absoluta.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-20 mb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-light text-charcoal font-display">
            Cómo funciona
          </h2>
          <div className="w-12 h-0.5 bg-gold/50 mx-auto mt-4"></div>
          <p className="text-text-muted mt-4 text-sm max-w-md mx-auto">
            Tres pasos simples para encontrar tu próximo hogar.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-gradient-to-r from-gold/30 to-transparent" />
              )}

              <div className="flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-surface-container-low border border-gold/20 flex items-center justify-center text-gold  transition-all duration-300">
                    {step.icon}
                  </div>
                  {/* Step Number */}
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-charcoal text-white text-[10px] font-bold flex items-center justify-center font-sans">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-charcoal font-display mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed max-w-[240px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
