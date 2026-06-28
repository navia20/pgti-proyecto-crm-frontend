"use client";

import { useState } from "react";
import "./SourceChart.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { MetricasFuente } from "../../lib/api/reportes.api";

interface SourceChartProps {
  data: MetricasFuente;
}

const COLORS: Record<string, string> = {
  Pedidos: "#284b63",
  Suscripciones: "#3c6e71",
  Pagos: "#6b7280",
  Salud: "#22c55e",
  Interno: "#d9d9d9",
};

export default function SourceChart({ data }: SourceChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = [
    { nombre: "Pedidos", valor: data.pedidos, color: COLORS.Pedidos },
    { nombre: "Suscripciones", valor: data.suscripciones, color: COLORS.Suscripciones },
    { nombre: "Pagos", valor: data.pagos, color: COLORS.Pagos },
    { nombre: "Salud", valor: data.salud, color: COLORS.Salud },
    { nombre: "Interno", valor: data.interno, color: COLORS.Interno },
  ].filter((d) => d.valor > 0);

  const total = data.total;

  return (
    <div className="source-chart">
      <div className="source-chart__header">
        <div className="source-chart__title">Tickets por Sistema de Origen</div>
        <div className="source-chart__total">{total} total</div>
      </div>

      <div className="source-chart__body">
        <ResponsiveContainer width={240} height={260}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={2}
              dataKey="valor"
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={1200}
              animationEasing="ease-out"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                  style={{
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                    cursor: "pointer",
                  }}
                />
              ))}
              <Label
                value={total}
                position="center"
                style={{ fontSize: "1.5rem", fontWeight: 600, fill: "#353535" }}
              />
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                fontSize: "0.8rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              formatter={(value, name) => {
                const num = typeof value === "number" ? value : 0;
                const pct = total > 0 ? ((num / total) * 100).toFixed(1) : "0";
                return [`${num} tickets (${pct}%)`, String(name)];
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="source-chart__legend">
          {chartData.map((item, index) => {
            const pct = total > 0 ? ((item.valor / total) * 100).toFixed(1) : "0";
            const isActive = activeIndex === null || activeIndex === index;
            return (
              <div
                key={item.nombre}
                className={`source-chart__legend-item ${isActive ? "" : "source-chart__legend-item--dim"}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div
                  className="source-chart__legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="source-chart__legend-name">{item.nombre}</span>
                <span className="source-chart__legend-pct">{pct}%</span>
                <span className="source-chart__legend-count">{item.valor}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
