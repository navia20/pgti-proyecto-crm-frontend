import { API_ROUTES } from "./config";

export interface Solicitud {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  descripcion: string;
  estado: "pendiente" | "aprobada" | "rechazada";
  motivo_rechazo?: string;
  creado_en: string;
}

export interface CrearSolicitudPayload {
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  descripcion: string;
}

export interface AprobarSolicitudPayload {
  asunto?: string;
  descripcion?: string;
  prioridad?: "baja" | "media" | "alta" | "critica";
  canal?: "chat" | "email" | "telefono" | "app";
}

export const solicitudesApi = {
  crear: async (dto: CrearSolicitudPayload): Promise<{ ok: boolean; mensaje: string; id: string }> => {
    const res = await fetch(API_ROUTES.solicitudes, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Error al enviar solicitud" }));
      throw new Error(err.message || "Error al enviar solicitud");
    }
    return res.json();
  },

  getAll: async (estado?: string): Promise<{ data: Solicitud[]; total: number }> => {
    const url = new URL(API_ROUTES.solicitudes);
    if (estado) url.searchParams.set("estado", estado);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Error al obtener solicitudes");
    return res.json();
  },

  getPendientesCount: async (): Promise<number> => {
    const res = await fetch(API_ROUTES.solicitudesPendientesCount);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.total ?? 0;
  },

  aprobar: async (id: string, dto: AprobarSolicitudPayload): Promise<{ solicitud: Solicitud; ticketId: string }> => {
    const res = await fetch(API_ROUTES.aprobarSolicitud(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Error al aprobar" }));
      throw new Error(err.message || "Error al aprobar solicitud");
    }
    return res.json();
  },

  rechazar: async (id: string, motivo: string): Promise<Solicitud> => {
    const res = await fetch(API_ROUTES.rechazarSolicitud(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivo }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Error al rechazar" }));
      throw new Error(err.message || "Error al rechazar solicitud");
    }
    return res.json();
  },
};
