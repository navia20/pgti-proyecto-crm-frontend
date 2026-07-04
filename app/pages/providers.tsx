"use client";

import { RoleProvider } from "@/app/lib/context/RoleContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <RoleProvider>{children}</RoleProvider>;
}
