import "./TicketsList.css";
import { TicketCliente } from "../../lib/types/cliente.types";

interface TicketsListProps {
  tickets: TicketCliente[];
}

const statusLabel: Record<string, string> = {
  abierto: "Abierto",
  en_progreso: "En progreso",
  resuelto: "Resuelto",
};

const priorityLabel: Record<string, string> = {
  urgente: "Urgente",
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export default function TicketsList({ tickets }: TicketsListProps) {
  return (
    <div className="tickets-list">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="tickets-list__item">
          <div className="tickets-list__top">
            <span className="tickets-list__title">{ticket.title}</span>
            <div className="tickets-list__badges">
              <span
                className={`tickets-list__badge tickets-list__badge--status-${ticket.status}`}
              >
                {statusLabel[ticket.status]}
              </span>
              <span
                className={`tickets-list__badge tickets-list__badge--priority-${ticket.priority}`}
              >
                {priorityLabel[ticket.priority]}
              </span>
            </div>
          </div>
          <p className="tickets-list__description">{ticket.description}</p>
          <div className="tickets-list__meta">
            <span>{ticket.created}</span>
            <span>·</span>
            <span>{ticket.assignee}</span>
          </div>
        </div>
      ))}
    </div>
  );
}