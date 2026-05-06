import "./ClienteHeader.css";
import { Building2, MapPin, Calendar, Mail, Phone, MessageSquare, MoreHorizontal } from "lucide-react";
import { ClientePerfil } from "../../lib/types/cliente.types";

interface ClienteHeaderProps {
  cliente: ClientePerfil;
}

export default function ClienteHeader({ cliente }: ClienteHeaderProps) {
  return (
    <div className="cliente-header">
      <div className="cliente-header__top">
        {/* Identidad */}
        <div className="cliente-header__identity">
          <div className="cliente-header__avatar">
            {cliente.name.charAt(0)}
          </div>
          <div className="cliente-header__info">
            <div className="cliente-header__name">
              {cliente.name}
              <span className={`cliente-header__status cliente-header__status--${cliente.status}`}>
                {cliente.status === "active" ? "active" : "inactive"}
              </span>
            </div>
            <div className="cliente-header__meta">
              <span className="cliente-header__meta-item">
                <Building2 size={13} />
                {cliente.company}
              </span>
              <span className="cliente-header__meta-item">
                <MapPin size={13} />
                {cliente.location}
              </span>
              <span className="cliente-header__meta-item">
                <Calendar size={13} />
                Cliente desde {cliente.customerSince}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="cliente-header__actions">
          <button className="cliente-header__action-btn">
            <Mail size={14} />
            Email
          </button>
          <button className="cliente-header__action-btn">
            <Phone size={14} />
            Llamar
          </button>
          <button className="cliente-header__action-btn">
            <MessageSquare size={14} />
            Mensaje
          </button>
          <button className="cliente-header__action-btn cliente-header__action-btn--more">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Contacto */}
      <div className="cliente-header__contact">
        <div className="cliente-header__contact-item">
          <span className="cliente-header__contact-label">Email</span>
          {cliente.email}
        </div>
        <div className="cliente-header__contact-item">
          <span className="cliente-header__contact-label">Teléfono</span>
          {cliente.phone}
        </div>
      </div>
    </div>
  );
}