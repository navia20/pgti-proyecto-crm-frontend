"use client";

import React, { createContext, useContext, useState } from "react";

export type Role = "admin" | "agente";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  esAdmin: boolean;
}

const RoleContext = createContext<RoleContextType>({
  role: "admin",
  setRole: () => {},
  esAdmin: true,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  return (
    <RoleContext.Provider value={{ role, setRole, esAdmin: role === "admin" }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
