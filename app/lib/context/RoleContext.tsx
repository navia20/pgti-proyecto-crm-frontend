"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "../auth/KeycloakProvider";

export type Role = "admin" | "agente";

interface RoleContextType {
  role: Role;
  esAdmin: boolean;
  userEmail: string;
}

const RoleContext = createContext<RoleContextType>({
  role: "agente",
  esAdmin: false,
  userEmail: "",
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { keycloak } = useAuth();

  const value = useMemo(() => {
    const appRoles: string[] =
      keycloak.tokenParsed?.resource_access?.p7?.roles ?? [];
    const isAdmin = appRoles.includes("admin");
    const email = keycloak.tokenParsed?.preferred_username ?? "";
    return {
      role: (isAdmin ? "admin" : "agente") as Role,
      esAdmin: isAdmin,
      userEmail: email,
    };
  }, [keycloak]);

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
