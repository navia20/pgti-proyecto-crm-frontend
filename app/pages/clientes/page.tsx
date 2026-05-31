"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Users } from "lucide-react";
import ClienteHeader from "../../components/clientes/ClienteHeader";
import ClienteMetrics from "../../components/clientes/ClienteMetrics";
import ActivityTimeline from "../../components/clientes/ActivityTimeline";
import DealsList from "../../components/clientes/DealsList";
import TicketsList from "../../components/clientes/TicketsList";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonTable, SkeletonProfile } from "../../components/ui/Skeleton";
import { clientesApi } from "../../lib/api/clientes.api";
import { ticketsApi } from "../../lib/api/tickets.api";
import {
  mockClienteMetrics,
  mockActividades,
  mockDeals,
  mockClienteSalud,
} from "../../lib/mocks/clientes.mock";
import { ClientePerfil, TicketCliente } from "../../lib/types/cliente.types";
import { Ticket } from "../../lib/types/ticket.types";

type TabType = "resumen" | "actividad" | "deals" | "tickets";

const tabs: { value: TabType; label: string }[] = [
  { value: "resumen", label: "Resumen" },
  { value: "actividad", label: "Actividad" },
  { value: "deals", label: "Deals" },
  { value: "tickets", label: "Tickets" },
];

function mapTicketToClienteTicket(t: Ticket): TicketCliente {
  const statusMap: Record<string, TicketCliente["status"]> = {
    abierto: "abierto",
    progreso: "en_progreso",
    resuelto: "resuelto",
    cerrado: "resuelto",
  };
  const priorityMap: Record<string, TicketCliente["priority"]> = {
    critica: "urgente",
    alta: "alta",
    media: "media",
    baja: "baja",
  };
  return {
    id: t.id,
    title: t.asunto,
    description: `Canal: ${t.canal}`,
    status: statusMap[t.estado] ?? "abierto",
    priority: priorityMap[t.prioridad] ?? "media",
    created: new Date(t.fecha_vencimiento_sla).toLocaleDateString("es-ES"),
    assignee: t.agente_nombre,
  };
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ClientePerfil[]>([]);
  const [selectedCliente, setSelectedCliente] = useState<ClientePerfil | null>(null);
  const [ticketsCliente, setTicketsCliente] = useState<TicketCliente[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("resumen");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPerfil, setIsLoadingPerfil] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setIsLoading(true);
        const data = await clientesApi.getAll();
        setClientes(data);
      } catch {
        setError("Usando datos locales — backend no disponible");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const handleSelectCliente = async (cliente: ClientePerfil) => {
    setSelectedCliente(cliente);
    setIsLoadingPerfil(true);
    setActiveTab("resumen");
    try {
      const tickets = await ticketsApi.getAll({ cliente_id: cliente.id });
      setTicketsCliente(tickets.map(mapTicketToClienteTicket));
    } catch {
      setTicketsCliente([]);
    } finally {
      setIsLoadingPerfil(false);
    }
  };

  const filtered = clientes.filter(
    (c) =>
      c.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.empresa ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (selectedCliente) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-auto">
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[#d9d9d9] bg-white">
          <button
            onClick={() => { setSelectedCliente(null); setActiveTab("resumen"); }}
            className="flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#353535] transition-colors"
          >
            <ArrowLeft size={16} />
            Volver a clientes
          </button>
        </div>

        {isLoadingPerfil ? (
          <SkeletonProfile />
        ) : (
          <>
            <ClienteHeader cliente={selectedCliente} salud={mockClienteSalud} />
            <ClienteMetrics metrics={mockClienteMetrics} />

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
                      <TicketsList tickets={ticketsCliente.slice(0, 2)} />
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
                  <DealsList deals={mockDeals} />
                </div>
              )}

              {activeTab === "tickets" && (
                <div className="max-w-3xl">
                  {ticketsCliente.length === 0 ? (
                    <EmptyState
                      icon={Users}
                      title="Sin tickets"
                      description="Este cliente no tiene tickets registrados."
                    />
                  ) : (
                    <TicketsList tickets={ticketsCliente} />
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[#353535] tracking-tight mb-1">
            Clientes
          </h1>
          <p className="text-sm text-[#6b7280]">
            {clientes.length} clientes registrados
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#3c6e71] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2d5557] transition-colors">
          + Nuevo Cliente
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          ⚠️ {error}
        </div>
      )}

      <div className="flex items-center gap-2 border border-[#d9d9d9] rounded-lg px-3 py-2 bg-white mb-6 max-w-sm">
        <Search size={14} className="text-[#6b7280]" />
        <input
          type="text"
          placeholder="Buscar por nombre, empresa o email..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className="text-sm text-[#353535] bg-transparent outline-none w-full placeholder:text-[#9ca3af]"
        />
      </div>

      {isLoading ? (
        <SkeletonTable rows={6} />
      ) : filtered.length === 0 ? (
        <div className="border border-[#d9d9d9] rounded-xl">
          <EmptyState
            icon={Users}
            title="No se encontraron clientes"
            description={
              search
                ? `No hay clientes que coincidan con "${search}".`
                : "Aún no hay clientes registrados en el sistema."
            }
            actionLabel={search ? "Limpiar búsqueda" : undefined}
            onAction={search ? () => setSearch("") : undefined}
          />
        </div>
      ) : (
        <div className="border border-[#d9d9d9] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#284b63]">
                {["Nombre", "Email", "Teléfono", "Empresa", "Estado", ""].map((h) => (
                  <th key={h} className="text-left text-white text-xs font-medium px-4 py-3 tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b border-[#d9d9d9] last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleSelectCliente(cliente)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-[#353535]">
                    {cliente.nombre_completo}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">
                    {cliente.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">
                    {cliente.telefono ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6b7280]">
                    {cliente.empresa ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      cliente.estado === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {cliente.estado === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-xs text-[#3c6e71] hover:underline font-medium"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        handleSelectCliente(cliente);
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
      )}
    </div>
  );
}