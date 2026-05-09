"use client";

import { useState } from "react";
import {
  Ticket,
  Clock,
  CheckCircle2,
  Smile,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import MetricCard from "../../components/soporte/MetricCard";
import TrendChart from "../../components/soporte/TrendChart";
import PriorityChart from "../../components/soporte/PriorityChart";
import AgentTable from "../../components/soporte/AgentTable";
import {
  mockTicketTrend,
  mockPriorityData,
  mockCategoryData,
  mockAgentData,
} from "../../lib/mocks/soporte.mock";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const periodOptions = [
  { value: "24h", label: "Últimas 24 horas" },
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "90d", label: "Últimos 90 días" },
];

const kpis = [
  { label: "Tickets Activos", value: 330, change: -8.2, icon: Ticket },
  { label: "Tiempo de Respuesta", value: "2.3h", change: -12.5, icon: Clock },
  { label: "Tasa de Resolución", value: "94.2%", change: 3.1, icon: CheckCircle2 },
  { label: "Satisfacción (CSAT)", value: "4.7", change: 2.8, icon: Smile },
];

export default function SoportePage() {
  const [period, setPeriod] = useState("7d");

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Panel de Soporte
          </h1>
          <p className="text-sm text-[#6b7280]">
            Última actualización: 9 de mayo, 2026 - 14:32
          </p>
        </div>

        <div className="flex items-center gap-2 border border-[#d9d9d9] rounded-lg px-3 py-2 bg-white">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm text-[#353535] bg-transparent outline-none cursor-pointer"
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <MetricCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
          />
        ))}
      </div>

      {/* Gráficos fila 1 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <TrendChart data={mockTicketTrend} />
        <PriorityChart data={mockPriorityData} />
      </div>

      {/* Gráficos fila 2 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Tickets por categoría */}
        <div className="bg-white border border-[#d9d9d9] rounded-xl p-6">
          <div className="text-base font-semibold text-[#353535] mb-4">
            Tickets por Categoría
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={mockCategoryData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d9d9d9" vertical={false} />
              <XAxis
                dataKey="categoria"
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
              <Bar
                dataKey="tickets"
                fill="#3c6e71"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rendimiento agentes */}
        <AgentTable agents={mockAgentData} />
      </div>

      {/* Banner de alerta */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-sm font-medium text-amber-900">
            23 tickets críticos requieren atención inmediata
          </div>
          <div className="text-xs text-amber-700 mt-0.5">
            15 tickets han excedido el SLA de 4 horas · 8 tickets sin asignar
          </div>
        </div>
        <TrendingUp size={18} className="text-amber-600 flex-shrink-0" />
      </div>
    </div>
  );
}