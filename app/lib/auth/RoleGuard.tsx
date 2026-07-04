"use client";

import { useAuth } from "./KeycloakProvider";

const REQUIRED_ROLE = "p7-access";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { keycloak } = useAuth();
  const roles: string[] = keycloak.tokenParsed?.realm_access?.roles ?? [];
  const hasAccess = roles.includes(REQUIRED_ROLE);

  if (!hasAccess)
    return (
      <AccessDenied
        username={keycloak.tokenParsed?.preferred_username ?? "desconocido"}
        onLogout={() => keycloak.logout()}
      />
    );

  return <>{children}</>;
}

function AccessDenied({
  username,
  onLogout,
}: {
  username: string;
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-sm px-8 py-10">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Acceso denegado
        </h1>
        <p className="text-sm text-gray-500 mb-1">
          Tu cuenta no tiene permisos para acceder al módulo CRM.
        </p>
        <p className="text-xs text-gray-400 mb-8">
          Contacta al administrador del sistema si crees que es un error.
        </p>
        <button
          onClick={onLogout}
          className="w-full py-2.5 px-4 text-sm rounded-lg bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
        <p className="text-xs text-gray-400 mt-6">
          Usuario: <code className="font-mono">{username}</code>
        </p>
      </div>
    </div>
  );
}
