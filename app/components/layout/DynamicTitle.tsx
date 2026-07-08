"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/pages/dashboard": "Dashboard",
  "/pages/tickets": "Tickets",
  "/pages/clientes": "Clientes",
  "/pages/duplicados": "Duplicados",
  "/pages/soporte": "Soporte",
};

export default function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    const title = TITLES[pathname] || "CRM";
    document.title = `${title} | CRM`;
  }, [pathname]);

  return null;
}
