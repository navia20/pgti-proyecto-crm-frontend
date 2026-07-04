import { TicketEstado, TicketPrioridad, TicketCanal, Interaccion } from "./ticket.types";

export type CanalNotificacion = "email" | "whatsapp" | "sms" | "otro";

export interface EnlaceTicket {
  id: string;
  asunto: string;
  estado: TicketEstado;
  prioridad: TicketPrioridad;
  canal: TicketCanal;
  cliente_nombre: string;
  creado_en: string;
}

export interface EnlaceResponse {
  ticket: EnlaceTicket;
  interacciones: Interaccion[];
  expira_en: string;
}

export interface EnlaceCrearResponse {
  token: string;
  url: string;
}
