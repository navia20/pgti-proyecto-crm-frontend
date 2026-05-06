"use client";

import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import ClienteHeader from "../../components/clientes/ClienteHeader";
import ClienteMetrics from "../../components/clientes/ClienteMetrics";
import ActivityTimeline from "../../components/clientes/ActivityTimeline";
import DealsList from "../../components/clientes/DealsList";
import TicketsList from "../../components/clientes/TicketsList";
import {
  mockClientePerfil,
  mockClienteMetrics,
  mockActividades,
  mockDeals,
  mockTicketsCliente,
} from "../../lib/mocks/clientes.mock";

type TabType = "resumen" | "actividad" | "deals" | "tickets";

const tabs: { value: TabType; label: string }[] = [
  { value: "resumen", label: "Resumen" },
  { value: "actividad", label: "Actividad" },
  { value: "deals", label: "Deals" },
  { value: "tickets", label: "Tickets" },
];

const mockClientesList = [
  { id: "1", name: "María González", company: "TechCorp Solutions", email: "maria.gonzalez@techcorp.com", location: "Madrid, España", status: "active", ltv: "€145,200", tickets: 2 },
  { id: "2", name: "Carlos Rodríguez", company: "Innovatech SL", email: "carlos.r@innovatech.es", location: "Barcelona, España", status: "active", ltv: "€89,500", tickets: 1 },
  { id: "3", name: "Ana Martínez", company: "Digital Labs", email: "ana.m@digitallabs.com", location: "Valencia, España", status: "inactive", ltv: "€34,200", tickets: 0 },
  { id: "4", name: "Pedro Sánchez", company: "StartupXYZ", email: "pedro@startupxyz.com", location: "Sevilla, España", status: "active", ltv: "€12,800", tickets: 3 },
];

export default function ClientesPage() {
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("resumen");
  const [search, setSearch] = useState("");

  const filtered = mockClientesList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedCliente) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[#d9d9d9] bg-white">
          <button
            onClick={() => { setSelectedCliente(null); setActiveTab("resumen"); }}
            className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#353535] transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a clientes
          </button>
        </div>

        {/* Header del cliente */}
        <ClienteHeader cliente={mockClientePerfil} />

        {/* Métricas */}
        <ClienteMetrics metrics={mockClienteMetrics} />

        {/* Tabs */}
        <div className="px-8 py-6 flex-1">
          <div className="flex gap-1 mb-6 border-b border-[#d9d9d9]">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.value
                    ? "border-[#3c6e71] text-[#3c6e71]"
                    : "border-transparent text-[#6b7280] hover:text-[#353535]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido tabs */}
          {activeTab === "resumen" && (
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[#353535] mb-4">
                  Actividad Reciente
                </h3>
                <div className="border-t border-[#d9d9d9] pt-4">
                  <ActivityTimeline activities={mockActividades.slice(0, 4)} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#353535] mb-4">
                  Deals Activos
                </h3>
                <div className="border-t border-[#d9d9d9] pt-4">
                  <DealsList deals={mockDeals.slice(0, 3)} />
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-semibold text-[#353535] mb-4">
                  Tickets Recientes
                </h3>
                <div className="border-t border-[#d9d9d9] pt-4">
                  <TicketsList tickets={mockTicketsCliente.slice(0, 2)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "actividad" && (
            <div className="max-w-2xl">
              <ActivityTimeline activities={mockActividades} />
            </div>
          )}

          {activeTab === "deals" && (
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#6b7280]">
                  Total en pipeline:{" "}
                  <span className="text-[#353535] font-medium">€104,200</span>
                </span>
              </div>
              <DealsList deals={mockDeals} />
            </div>
          )}

          {activeTab === "tickets" && (
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#6b7280]">
                  <span className="text-amber-600">2 abiertos</span>
                  {" · "}
                  <span className="text-[#3c6e71]">1 resuelto</span>
                </span>
              </div>
              <TicketsList tickets={mockTicketsCliente} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Clientes
          </h1>
          <p className="text-sm text-[#6b7280]">
            {mockClientesList.length} clientes registrados
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#3c6e71] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5557] transition-colors">
          + Nuevo Cliente
        </button>
      </div>

      {/* Búsqueda */}
      <div className="flex items-center gap-2 border border-[#d9d9d9] rounded-lg px-3 py-2 bg-white mb-6 max-w-sm">
        <Search size={14} className="text-[#6b7280]" />
        <input
          type="text"
          placeholder="Buscar por nombre, empresa o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm text-[#353535] bg-transparent outline-none w-full placeholder:text-[#9ca3af]"
        />
      </div>

      {/* Tabla */}
      <div className="border border-[#d9d9d9] rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#284b63]">
              {["Nombre", "Empresa", "Email", "Ubicación", "Estado", "LTV", "Tickets Abiertos", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-white text-xs font-medium px-4 py-3 tracking-wide"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((cliente) => (
              <tr
                key={cliente.id}
                className="border-b border-[#d9d9d9] last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedCliente(cliente.id)}
              >
                <td className="px-4 py-3 text-sm font-medium text-[#353535]">
                  {cliente.name}
                </td>
                <td className="px-4 py-3 text-sm text-[#6b7280]">
                  {cliente.company}
                </td>
                <td className="px-4 py-3 text-sm text-[#6b7280]">
                  {cliente.email}
                </td>
                <td className="px-4 py-3 text-sm text-[#6b7280]">
                  {cliente.location}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cliente.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cliente.status === "active" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-[#353535]">
                  {cliente.ltv}
                </td>
                <td className="px-4 py-3 text-sm text-center text-[#6b7280]">
                  {cliente.tickets}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="text-xs text-[#3c6e71] hover:underline font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCliente(cliente.id);
                    }}
                  >
                    Ver perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}