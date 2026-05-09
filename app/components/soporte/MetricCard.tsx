import "./MetricCard.css";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
}

export default function MetricCard({
  label,
  value,
  change,
  icon: Icon,
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="metric-card">
      <div className="metric-card__header">
        <span className="metric-card__label">{label}</span>
        <Icon size={18} className="metric-card__icon" />
      </div>
      <div className="metric-card__value-row">
        <span className="metric-card__value">{value}</span>
        <span
          className={`metric-card__change ${
            isPositive
              ? "metric-card__change--positive"
              : "metric-card__change--negative"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>
      <div className="metric-card__context">vs mes anterior</div>
    </div>
  );
}