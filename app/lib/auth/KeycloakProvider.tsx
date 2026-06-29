"use client";

import { SkeletonKpiGrid, SkeletonTable } from "@/app/components/ui/Skeleton";
import "@/app/components/ui/Skeleton.css";
import "@/app/components/layout/Topbar.css";
import Keycloak from "keycloak-js";
import { LayoutDashboard } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL!,
  realm: "sistema-centralizado",
  clientId: "p7",
});

interface AuthContextType {
  keycloak: Keycloak;
  initialized: boolean;
  authenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        checkLoginIframe: false,
      })
      .then((auth) => {
        setAuthenticated(auth);
        setInitialized(true);

        // Refresh token antes de que expire
        setInterval(() => {
          keycloak.updateToken(60).catch(() => keycloak.logout());
        }, 30000);
      })
      .catch(() => {
        setInitialized(true);
      });
  }, []);

  if (!initialized)
    return (
      <div className="min-h-screen flex flex-col bg-[#FFFFFF]">
        {/* Topbar falso */}
        <div className="topbar">
          <div className="topbar__brand">
            <div className="topbar__brand-icon">
              <LayoutDashboard size={18} color="#ffffff" />
            </div>
            <div>
              <div className="topbar__brand-text">ERP Sistema</div>
              <div className="topbar__brand-sub">CRM · Clientes y Soporte</div>
            </div>
          </div>
        </div>

        {/* Contenido skeleton */}
        <div className="px-8 py-8 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col gap-2">
              <div
                className="skeleton skeleton--text-lg"
                style={{ width: "200px" }}
              />
              <div
                className="skeleton skeleton--text-sm"
                style={{ width: "260px" }}
              />
            </div>
          </div>
          <SkeletonKpiGrid />
          <SkeletonTable rows={6} />
        </div>
      </div>
    );

  return (
    <AuthContext.Provider value={{ keycloak, initialized, authenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fuera de KeycloakProvider");
  return ctx;
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  await keycloak.updateToken(30).catch(() => keycloak.logout());

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${keycloak.token}`,
    },
  });
}
