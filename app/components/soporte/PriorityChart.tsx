"use client";

import "./PriorityChart.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PriorityData } from "../../lib/mocks/soporte.mock";

interface PriorityChartProps {
  data: PriorityData[];
}

export default function PriorityChart({ data }: PriorityChartProps) {
  return (
    <div className="priority-chart">
      <div className="priority-chart__header">
        <div className="priority-chart__title">Distribución por Prioridad</div>
      </div>

      <div className="priority-chart__body">
        <ResponsiveContainer width={220} height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={100}
              paddingAngle={2}
              dataKey="valor"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #d9d9d9",
                borderRadius: "8px",
                fontSize: "0.8rem",
              }}
              formatter={(value) => [`${value} tickets`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="priority-chart__legend">
          {data.map((item) => (
            <div key={item.nombre} className="priority-chart__legend-item">
              <div
                className="priority-chart__legend-dot"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.nombre}</span>
              <span className="priority-chart__legend-count">{item.valor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}