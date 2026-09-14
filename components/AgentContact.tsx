import { FiCalendar, FiMail } from "react-icons/fi";
import { Rule } from "./ui/primitives";

/*
 * AgentContact — Folio y Sello.
 *
 * Lo que cambió y por qué importa: esta tarjeta mostraba un retrato cargado desde
 * Google, el nombre "Sarah Nomos" y el sello "Agente Destacado". Nada de eso es
 * real: no hay ninguna persona en el modelo de datos y "destacado" es un claim
 * que la plataforma no puede sostener. Se retiró la identidad inventada y quedan
 * los canales de contacto, que sí funcionan.
 *
 * PARA PRODUCCIÓN: si querés mostrar un agente real, hay que agregar los campos
 * de agente (nombre, foto, teléfono) a `properties` o a una tabla `agents` y
 * pasarlos como props. No los invento.
 */

interface AgentContactProps {
  scheduleVisitLabel: string;
  contactAgentLabel: string;
}

const AGENT_EMAIL = "hola@nomosestate.com";

export default function AgentContact({
  scheduleVisitLabel,
  contactAgentLabel,
}: AgentContactProps) {
  return (
    <div>
      <Rule />
      <p className="indicador pt-4">Consultas</p>

      <div className="mt-4 space-y-3">
        <a
          href={`mailto:${AGENT_EMAIL}?subject=Agendar%20visita%20-%20Propiedad`}
          className="inline-flex h-14 w-full items-center justify-center gap-3 border border-tinta bg-tinta px-6 text-menudo font-medium text-hoja transition-colors hover:bg-charcoal-hover"
        >
          <FiCalendar aria-hidden="true" className="text-base" />
          {scheduleVisitLabel}
        </a>
        <a
          href={`mailto:${AGENT_EMAIL}?subject=Consulta%20sobre%20propiedad`}
          className="inline-flex h-14 w-full items-center justify-center gap-3 border border-rule-fuerte px-6 text-menudo font-medium text-tinta transition-colors hover:border-tinta"
        >
          <FiMail aria-hidden="true" className="text-base" />
          {contactAgentLabel}
        </a>
      </div>

      <p className="mt-4 text-menudo text-tinta-tenue">
        Respondemos dentro del día hábil.{" "}
        <a
          href={`mailto:${AGENT_EMAIL}`}
          className="border-b border-transparent text-tinta transition-colors hover:border-tinta"
        >
          {AGENT_EMAIL}
        </a>
      </p>
    </div>
  );
}
