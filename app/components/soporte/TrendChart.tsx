"use client";

import "./TrendChart.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TicketTrendData } from "../../lib/mocks/soporte.mock";

interface TrendChartProps {
  data: TicketTrendData[];
}

const lines = [
  { key: "abiertos", color: "#3c6e71", label: "Abiertos" },
  { key: "cerrados", color: "#284b63", label: "Cerrados" },
  { key: "resueltos", color: "#22c55e", label: "Resueltos" },
];

export default function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="trend-chart">
      <div className="trend-chart__header">
        <div className="trend-chart__title">Tendencia de Tickets</div>
        <div className="trend-chart__legend">
          {lines.map((l) => (
            <div key={l.key} className="trend-chart__legend-item">
              <div
                className="trend-chart__legend-dot"
                style={{ backgroundColor: l.color }}
              />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d9d9d9" vertical={false} />
          <XAxis
            dataKey="fecha"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              fontSize: "0.8rem",
              color: "#353535",
            }}
          />
          {lines.map((l) => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              stroke={l.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}