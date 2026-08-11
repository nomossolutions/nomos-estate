import { FiMessageSquare, FiPhone, FiCalendar, FiMail } from "react-icons/fi";
import Image from "next/image";

const AGENT_EMAIL = "sarah@nomosestate.com";
const AGENT_PHONE = "+13055551234";

interface AgentContactProps {
  scheduleVisitLabel: string;
  contactAgentLabel: string;
}

export default function AgentContact({
  scheduleVisitLabel,
  contactAgentLabel,
}: AgentContactProps) {
  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w"
          alt="Agente de Ventas"
          width={56}
          height={56}
          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div>
          <h3 className="font-semibold text-charcoal font-display">
            Sarah Nomos
          </h3>
          <div className="flex items-center gap-1 text-xs text-gold font-medium">
            <span>Agente Destacado</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <a
            href={`https://wa.me/${AGENT_PHONE.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gold/10 text-gold hover:bg-gold hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            aria-label="Enviar mensaje por WhatsApp"
          >
            <FiMessageSquare className="text-sm" />
          </a>
          <a
            href={`tel:${AGENT_PHONE}`}
            className="p-2 rounded-full bg-gold/10 text-gold hover:bg-gold hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            aria-label="Llamar al agente"
          >
            <FiPhone className="text-sm" />
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <a
          href={`mailto:${AGENT_EMAIL}?subject=Agendar%20visita%20-%20Propiedad`}
          className="w-full bg-charcoal hover:bg-charcoal-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-soft flex items-center justify-center gap-2 group focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        >
          <FiCalendar className="text-xl group-hover:scale-110 transition-transform" />
          {scheduleVisitLabel}
        </a>
        <a
          href={`mailto:${AGENT_EMAIL}?subject=Consulta%20sobre%20propiedad`}
          className="w-full bg-transparent border border-charcoal/10 hover:border-gold text-charcoal/80 hover:text-gold py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        >
          <FiMail className="text-xl" />
          {contactAgentLabel}
        </a>
      </div>
    </>
  );
}
