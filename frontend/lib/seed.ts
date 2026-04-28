import rawSeed from "../data/seed.json";
import type {
  Property, Room, Tenant, Lead, Contract, Payment,
  Incident, Inspection, Technician, KpiDataPoint,
  RevenueDataPoint, AutomationRun, ErrorLogEntry, ActivityEntry,
} from "./types";

const seed = rawSeed as {
  properties: Property[];
  rooms: Room[];
  tenants: Tenant[];
  leads: Lead[];
  contracts: Contract[];
  payments: Payment[];
  incidents: Incident[];
  inspections: Inspection[];
  technicians: Technician[];
  kpi_history: KpiDataPoint[];
  revenue_by_property: RevenueDataPoint[];
  automation_runs: AutomationRun[];
  error_log: ErrorLogEntry[];
  activity_feed: ActivityEntry[];
};

export const { properties, rooms, tenants, leads, contracts, payments, incidents, inspections, technicians, kpi_history, revenue_by_property, automation_runs, error_log, activity_feed } = seed;

/* Demo "now" — hardcoded so SLA semaphores are always consistent */
export const NOW = new Date("2026-04-25T12:00:00Z");

export function getSlaHoursElapsed(createdAt: string): number {
  return (NOW.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);
}

export function getSlaStatus(incident: Incident): "ok" | "warning" | "critical" {
  const elapsed = getSlaHoursElapsed(incident.created_at);
  if (incident.status === "Resuelta" || incident.status === "Cerrada") return "ok";
  if (elapsed > incident.sla_hours * 2) return "critical";
  if (elapsed > incident.sla_hours) return "warning";
  return "ok";
}

export function getRoom(id: string) {
  return rooms.find((r) => r.id === id);
}

export function getTenant(id: string) {
  return tenants.find((t) => t.id === id);
}

export function getTechnician(id: string) {
  return technicians.find((t) => t.id === id);
}

export function getProperty(id: string) {
  return properties.find((p) => p.id === id);
}

export function getContract(tenantId: string) {
  return contracts.find((c) => c.tenant_id === tenantId);
}

export function getTenantPayments(tenantId: string) {
  return payments.filter((p) => p.tenant_id === tenantId);
}

export function getTenantIncidents(tenantId: string) {
  return incidents.filter((i) => i.tenant_id === tenantId);
}

export function getRoomInspections(roomId: string) {
  return inspections.filter((i) => i.room_id === roomId);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(dateStr));
}

export function formatRelativeTime(dateStr: string): string {
  const diff = NOW.getTime() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 1) return `hace ${days} días`;
  if (days === 1) return "hace 1 día";
  if (hours > 1) return `hace ${hours} horas`;
  return "hace menos de 1 hora";
}
