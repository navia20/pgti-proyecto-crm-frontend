import "./ClienteDashboardHeader.css";
import React from "react";
import { ClientePerfil } from "../../lib/types/cliente.types";

interface ClienteDashboardHeaderProps {
  cliente: ClientePerfil;
}

export default function ClienteDashboardHeader({ cliente }: ClienteDashboardHeaderProps) {
  return (
    <div className="cliente-dash-header">
      <div className="cliente-dash-header__left">
        <div className="cliente-dash-header__avatar">
          {cliente.nombre_completo.charAt(0)}
        </div>
        <div className="cliente-dash-header__info">
          <div className="cliente-dash-header__name">
            Hola, {cliente.nombre_completo.split(" ")[0]}
          </div>
          <div className="cliente-dash-header__email">
            {cliente.email}
          </div>
        </div>
      </div>

      <div className="cliente-dash-header__brand">
        <div className="cliente-dash-header__brand-name">ERP Sistema</div>
        <div className="cliente-dash-header__brand-sub">Portal de Soporte</div>
      </div>
    </div>
  );
}