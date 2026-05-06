"use client";

import "./Topbar.css";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Ticket, Users, Copy, HeadphonesIcon } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/pages/dashboard", icon: LayoutDashboard },
  { label: "Tickets", href: "/pages/tickets", icon: Ticket },
  { label: "Clientes", href: "/pages/clientes", icon: Users },
  { label: "Duplicados", href: "/pages/duplicados", icon: Copy },
  { label: "Soporte", href: "/pages/soporte", icon: HeadphonesIcon },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="topbar">
      {/* Brand */}
      <div className="topbar__brand">
        <div className="topbar__brand-icon">
          <LayoutDashboard size={18} color="#ffffff" />
        </div>
        <div>
          <div className="topbar__brand-text">ERP Sistema</div>
          <div className="topbar__brand-sub">CRM · Clientes y Soporte</div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="topbar__nav">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`topbar__nav-link ${isActive ? "topbar__nav-link--active" : ""}`}
            >
              <span className="flex items-center gap-1.5">
                <Icon size={14} />
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Usuario */}
      <div className="topbar__actions">
        <div className="topbar__user">
          <div className="topbar__user-avatar">AD</div>
          <span>Admin</span>
        </div>
      </div>
    </header>
  );
}