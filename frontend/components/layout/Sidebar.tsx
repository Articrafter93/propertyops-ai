"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserCheck, Home, AlertTriangle,
  LogOut, Camera, Activity, ChevronRight, Building2, Wrench, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/auth/actions";
import type { UserRole } from "@/lib/roles";

const ADMIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/onboarding", label: "Onboarding", icon: UserCheck },
  { href: "/inquilinos", label: "Inquilinos", icon: Users },
  { href: "/habitaciones", label: "Habitaciones", icon: Home },
  { href: "/incidencias", label: "Incidencias", icon: AlertTriangle, badge: 3 },
  { href: "/checkout", label: "Checkout", icon: LogOut },
  { href: "/inspecciones", label: "Inspecciones", icon: Camera },
  { href: "/automatizaciones", label: "Automatizaciones", icon: Activity },
];

const TECNICO_NAV: Array<{ href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
  { href: "/incidencias", label: "Mis Incidencias", icon: AlertTriangle },
];

export function Sidebar({ userEmail, role }: { userEmail?: string; role?: UserRole }) {
  const pathname = usePathname();
  const navItems = role === 'tecnico' ? TECNICO_NAV : ADMIN_NAV;
  const RoleIcon = role === 'tecnico' ? Wrench : ShieldCheck;
  const roleLabel = role === 'tecnico' ? 'Técnico de Mantenimiento' : 'Administrador';

  return (
    <aside className="flex flex-col w-60 shrink-0 h-full" style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center justify-center w-8 h-8 rounded-md" style={{ background: "var(--sidebar-primary)" }}>
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold tracking-tight" style={{ color: "var(--sidebar-foreground)" }}>
            PropertyOps
          </span>
          <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "var(--sidebar-primary)", color: "white" }}>
            AI
          </span>
        </div>
      </div>

      {/* Role badge */}
      <div className="mx-3 mt-3 mb-1 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-muted/40 border border-border">
        <RoleIcon className="w-3 h-3 shrink-0" style={{ color: role === 'tecnico' ? '#7c3aed' : '#1a7070' }} />
        <span className="text-[10px] font-medium text-muted-foreground truncate">{roleLabel}</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group",
                isActive ? "text-white" : "hover:text-white"
              )}
              style={
                isActive
                  ? { background: "var(--sidebar-accent)", borderLeft: "3px solid var(--sidebar-primary)", paddingLeft: "calc(0.75rem - 3px)", color: "white" }
                  : { color: "var(--sidebar-foreground)", borderLeft: "3px solid transparent", paddingLeft: "calc(0.75rem - 3px)" }
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#dc2626", color: "white" }}>
                  {badge}
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer with logout */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "var(--sidebar-border)" }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--sidebar-primary)", color: "white" }}>
            {userEmail ? userEmail[0].toUpperCase() : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "var(--sidebar-foreground)" }}>{roleLabel}</p>
            <p className="text-[10px] truncate" style={{ color: "var(--sidebar-foreground)", opacity: 0.6 }}>{userEmail ?? "propertyops.demo"}</p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-semibold transition-colors hover:opacity-80"
            style={{ background: "rgba(42,173,160,0.15)", color: "#2aada0" }}
          >
            <LogOut className="w-3 h-3" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
