import { API_ROUTES } from "./config";
import { ClientePerfil } from "../types/cliente.types";
import { authFetch } from "../auth/KeycloakProvider";

export interface CrearClienteInput {
  nombre_completo: string;
  email: string;
  telefono?: string;
  empresa?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
}

function mapCliente(data: Record<string, unknown>): ClientePerfil {
  return {
    id: data.id as number,
    identidad_id: (data.identidad_id as string) ?? "",
    nombre_completo: data.nombre_completo as string,
    email: data.email as string,
    telefono: (data.telefono as string) ?? "",
    fecha_nacimiento: (data.fecha_nacimiento as string) ?? "",
    creado_en: data.creado_en as string,
    empresa: data.empresa as string | undefined,
    direccion: data.direccion as string | undefined,
    ciudad: data.ciudad as string | undefined,
    pais: data.pais as string | undefined,
    ubicacion: data.ciudad
      ? `${data.ciudad}${data.pais ? `, ${data.pais}` : ""}`
      : undefined,
    estado: (data.activo as boolean) ? "active" : "inactive",
  };
}

export const clientesApi = {
  getAll: async (): Promise<ClientePerfil[]> => {
    const res = await authFetch(API_ROUTES.clientes);
    if (!res.ok) throw new Error("Error al obtener clientes");
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapCliente) : [];
  },

  getById: async (id: number): Promise<ClientePerfil> => {
    const res = await authFetch(API_ROUTES.clienteById(id));
    if (!res.ok) throw new Error("Error al obtener cliente");
    const data = await res.json();
    return mapCliente(data);
  },

  crear: async (cliente: CrearClienteInput): Promise<ClientePerfil> => {
    const res = await authFetch(API_ROUTES.clientes, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    });
    if (!res.ok) throw new Error("Error al crear cliente");
    const data = await res.json();
    return mapCliente(data);
  },

  actualizar: async (id: number, cliente: CrearClienteInput): Promise<ClientePerfil> => {
    const res = await authFetch(API_ROUTES.clienteById(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    });
    if (!res.ok) throw new Error("Error al actualizar cliente");
    const data = await res.json();
    return mapCliente(data);
  },

  eliminar: async (id: number): Promise<void> => {
    const res = await authFetch(API_ROUTES.clienteById(id), {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Error al eliminar cliente");
  },

  getDuplicados: async (threshold = 50) => {
    const url = `${API_ROUTES.clientesDuplicados}?threshold=${threshold}`;
    const res = await authFetch(url);
    if (!res.ok) throw new Error("Error al obtener duplicados");
    return res.json();
  },

merge: async (payload: {
  cliente_principal_id: number;
  cliente_secundario_id: number;
  campos_a_conservar: string[];
}) => {
  const res = await authFetch(API_ROUTES.clientesMerge, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al fusionar clientes");
  return res.json();
},
};