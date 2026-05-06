import "./Kpicard.css";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface KpiCardProps {
  openTickets: number;
  urgentTickets: number;
  inProgressTickets: number;
  resolvedToday: number;
}

export default function KpiCard({
  openTickets,
  urgentTickets,
  inProgressTickets,
  resolvedToday,
}: KpiCardProps) {
  return (
    <div className="kpi-grid">
      {/* Tickets Abiertos */}
      <div className="kpi-card">
        <div className="kpi-card__header">
          <span className="kpi-card__label">Tickets Abiertos</span>
          <AlertCircle size={18} className="kpi-card__icon" />
        </div>
        <div className="kpi-card__value">{openTickets}</div>
        <div className="kpi-card__footer">+3 en última hora</div>
      </div>

      {/* Urgentes */}
      <div className="kpi-card kpi-card--urgent">
        <div className="kpi-card__header">
          <span className="kpi-card__label">Urgentes</span>
          <AlertCircle size={18} className="kpi-card__icon--urgent" />
        </div>
        <div className="kpi-card__value kpi-card__value--urgent">
          {urgentTickets}
        </div>
        <div className="kpi-card__footer">Requieren atención inmediata</div>
      </div>

      {/* En Progreso */}
      <div className="kpi-card">
        <div className="kpi-card__header">
          <span className="kpi-card__label">En Progreso</span>
          <Clock size={18} className="kpi-card__icon" />
        </div>
        <div className="kpi-card__value">{inProgressTickets}</div>
        <div className="kpi-card__footer">Siendo atendidos</div>
      </div>

      {/* Resueltos Hoy */}
      <div className="kpi-card">
        <div className="kpi-card__header">
          <span className="kpi-card__label">Resueltos Hoy</span>
          <CheckCircle2 size={18} className="kpi-card__icon" />
        </div>
        <div className="kpi-card__value">{resolvedToday}</div>
        <div className="kpi-card__footer kpi-card__footer--positive">
          <TrendingUp size={12} />
          +12% vs ayer
        </div>
      </div>
    </div>
  );
}