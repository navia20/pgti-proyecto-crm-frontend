import "./ClienteMetrics.css";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ClienteMetric } from "../../lib/types/cliente.types";

interface ClienteMetricsProps {
  metrics: ClienteMetric[];
}

export default function ClienteMetrics({ metrics }: ClienteMetricsProps) {
  return (
    <div className="cliente-metrics">
      {metrics.map((metric) => (
        <div key={metric.label} className="cliente-metrics__item">
          <div className="cliente-metrics__label">{metric.label}</div>
          <div className="cliente-metrics__value-row">
            <span className="cliente-metrics__value">{metric.value}</span>
            {metric.change && (
              <span
                className={`cliente-metrics__change ${
                  metric.change.positive
                    ? "cliente-metrics__change--positive"
                    : "cliente-metrics__change--negative"
                }`}
              >
                {metric.change.positive ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {metric.change.value}
              </span>
            )}
          </div>
          <div className="cliente-metrics__context">{metric.context}</div>
        </div>
      ))}
    </div>
  );
}