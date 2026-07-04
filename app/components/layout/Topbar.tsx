"use client";

import { interaccionesApi } from "../../lib/api/interacciones.api";
import "./Topbar.css";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Copy,
  HeadphonesIcon,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import CrearTicketModal from "../tickets/CrearTicketModal";
import { CrearTicketForm } from "../../lib/types/ticket.types";
import { ticketsApi } from "../../lib/api/tickets.api";
import { clientesApi } from "../../lib/api/clientes.api";
import { ClientePerfil } from "../../lib/types/cliente.types";

const navItems = [
  { label: "Dashboard", href: "/pages/dashboard", icon: LayoutDashboard },
  { label: "Tickets", href: "/pages/tickets", icon: Ticket },
  { label: "Clientes", href: "/pages/clientes", icon: Users },
  { label: "Duplicados", href: "/pages/duplicados", icon: Copy },
  { label: "Soporte", href: "/pages/soporte", icon: HeadphonesIcon },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [clientes, setClientes] = useState<ClientePerfil[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await clientesApi.getAll();
        setClientes(data);
      } catch {
        setClientes([]);
      }
    };
    fetchClientes();
  }, []);

const handleCrearTicket = async (form: CrearTicketForm) => {
  try {
    const ticket = await ticketsApi.crear(form);
    // Si hay descripción, crearla como primera interacción
    if (form.descripcion.trim() && ticket.id) {
      await interaccionesApi.crear({
        ticket_id: ticket.id,
        autor_tipo: "cliente",
        autor_id: "00000000-0000-0000-0000-000000000001",
        contenido: form.descripcion,
        es_nota_interna: false,
      });
    }
    setModalOpen(false);
    window.location.reload();
  } catch (error) {
    console.error("Error al crear ticket:", error);
  }
};

const handleCrearCliente = async (cliente: { nombre_completo: string; email: string; telefono?: string }) => {
  const nuevoCliente = await clientesApi.crear(cliente);
  setClientes((prev) => [...prev, nuevoCliente]);
  return nuevoCliente;
};

  return (
    <>
      <header className="topbar">
        {/* Brand */}
        <div className="topbar__brand">
          <div className="topbar__brand-icon">
            <LayoutDashboard size={18} color="#ffffff" />
          </div>
          <div>
            <div className="topbar__brand-text">ERP Sistema</div>
            <div className="topbar__brand-sub">CRM · Clientes y Soporte</div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="topbar__nav">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={`topbar__nav-link ${
                  isActive ? "topbar__nav-link--active" : ""
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Icon size={14} />
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Acciones */}
        <div className="topbar__actions">
          <button
            onClick={() => setModalOpen(true)}
            className="topbar__create-btn"
          >
            <Plus size={15} />
            Crear Ticket
          </button>
          <div className="topbar__user">
            <div className="topbar__user-avatar">AD</div>
            <span>Admin</span>
          </div>
        </div>
      </header>

      <CrearTicketModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCrearTicket}
        onCrearCliente={handleCrearCliente}
        clientes={clientes}
      />
    </>
  );
}