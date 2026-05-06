"use client";

import "./WeeklyChart.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { WeeklyChartData } from "@/app/lib/types/ticket.types";

interface WeeklyChartProps {
  data: WeeklyChartData[];
}

export default function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div className="weekly-chart">
      <div className="weekly-chart__header">
        <div className="weekly-chart__title">Tendencia Semanal</div>
        <div className="weekly-chart__subtitle">
          Tickets creados por día en los últimos 7 días
        </div>
      </div>

      <div className="weekly-chart__card">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3c6e71" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#3c6e71" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#d9d9d9" vertical={false} />
            <XAxis
              dataKey="day"
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
                fontSize: "0.875rem",
                color: "#353535",
              }}
              labelStyle={{ color: "#353535", fontWeight: 500 }}
            />
            <Area
              type="monotone"
              dataKey="tickets"
              stroke="#3c6e71"
              strokeWidth={2}
              fill="url(#colorTickets)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}