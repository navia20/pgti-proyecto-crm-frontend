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
import { usePathname } from "next/navigation";

const PUBLIC_PATHS = ["/cliente/solicitar-ticket"];
const PUBLIC_PREFIXES = ["/cliente/enlace/"];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

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
  const pathname = usePathname();
  const esRutaPublica = isPublicPath(pathname);

  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (esRutaPublica) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialized(true);
      return;
    }

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
  }, [esRutaPublica]);

  if (!initialized)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFFF]">
        <div className="w-8 h-8 border-2 border-[#d9d9d9] border-t-[#284b63] rounded-full animate-spin" />
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
