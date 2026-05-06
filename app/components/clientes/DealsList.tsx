import "./DealsList.css";
import { DollarSign, Calendar, Tag } from "lucide-react";
import { Deal } from "../../lib/types/cliente.types";

interface DealsListProps {
  deals: Deal[];
}

export default function DealsList({ deals }: DealsListProps) {
  return (
    <div className="deals-list">
      {deals.map((deal) => (
        <div key={deal.id} className="deals-list__item">
          <div className="deals-list__top">
            <span className="deals-list__title">{deal.title}</span>
            <span className={`deals-list__stage deals-list__stage--${deal.stage}`}>
              {deal.stage}
            </span>
          </div>
          <div className="deals-list__meta">
            <span className="deals-list__meta-item">
              <DollarSign size={12} />
              <span className="deals-list__value">{deal.value}</span>
            </span>
            <span className="deals-list__meta-item">
              <Calendar size={12} />
              Cierre: {deal.closeDate}
            </span>
            <span className="deals-list__meta-item">
              Probabilidad: {deal.probability}%
            </span>
            <span className="deals-list__meta-item">
              <Tag size={12} />
              {deal.source}
            </span>
          </div>
          <div className="deals-list__probability">
            <div className="deals-list__probability-bar">
              <div
                className="deals-list__probability-fill"
                style={{ width: `${deal.probability}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}