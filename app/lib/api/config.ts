export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const API_ROUTES = {
  // Tickets
  tickets: `${API_BASE_URL}/api/v1/tickets`,
  ticketById: (id: string) => `${API_BASE_URL}/api/v1/tickets/${id}`,
  ticketSlaStatus: `${API_BASE_URL}/api/v1/tickets/sla-status`,
  ticketsByCliente: (clienteId: number) =>
    `${API_BASE_URL}/api/v1/tickets/client/${clienteId}`,

  // Interacciones
  interacciones: `${API_BASE_URL}/api/v1/interacciones`,
  interaccionesByTicket: (ticketId: string) =>
    `${API_BASE_URL}/api/v1/interacciones/ticket/${ticketId}`,

  // Clientes
  clientes: `${API_BASE_URL}/api/v1/clientes`,
  clienteById: (id: number) => `${API_BASE_URL}/api/v1/clientes/${id}`,
  clientesDuplicados: `${API_BASE_URL}/api/v1/clientes/duplicados`,
  clientesMerge: `${API_BASE_URL}/api/v1/clientes/duplicados/merge`,

  // Artículos KB
  articulosKb: `${API_BASE_URL}/api/v1/articulos-kb`,
  articuloKbById: (id: string) =>
    `${API_BASE_URL}/api/v1/articulos-kb/${id}`,

  // Ticket Artículos
  ticketArticulos: `${API_BASE_URL}/api/v1/ticket-articulos`,
  ticketArticulosByTicket: (ticketId: string) =>
    `${API_BASE_URL}/api/v1/ticket-articulos/ticket/${ticketId}`,
};