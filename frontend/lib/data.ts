// Data access layer — async API backed by seed.json (static, no live database).
// 10 dashboard pages consume these helpers server-side.
import {
  properties, rooms, tenants, leads, contracts, payments,
  incidents, inspections, technicians, kpi_history,
  automation_runs, error_log, activity_feed,
} from './seed'
import type {
  Property, Room, Tenant, Lead, Contract, Payment,
  Incident, Inspection, Technician, AutomationRun,
  ErrorLogEntry, ActivityEntry, KpiDataPoint,
} from './types'

export async function getProperties(): Promise<Property[]> {
  return properties
}

export async function getRooms(): Promise<Room[]> {
  return rooms
}

export async function getTenants(): Promise<Tenant[]> {
  return tenants
}

export async function getTenant(id: string): Promise<Tenant | null> {
  return tenants.find((t) => t.id === id) ?? null
}

export async function getLeads(): Promise<Lead[]> {
  return [...leads].sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getContracts(): Promise<Contract[]> {
  return contracts
}

export async function getPayments(tenantId?: string): Promise<Payment[]> {
  const all = [...payments].sort((a, b) => b.date.localeCompare(a.date))
  return tenantId ? all.filter((p) => p.tenant_id === tenantId) : all
}

export async function getIncidents(): Promise<Incident[]> {
  return [...incidents].sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export async function getInspections(): Promise<Inspection[]> {
  return [...inspections].sort((a, b) => b.date.localeCompare(a.date))
}

export async function getInspection(id: string): Promise<Inspection | null> {
  return inspections.find((i) => i.id === id) ?? null
}

export async function getTechnicians(): Promise<Technician[]> {
  return technicians
}

export async function getAutomationRuns(): Promise<AutomationRun[]> {
  return automation_runs
}

export async function getErrorLogs(): Promise<ErrorLogEntry[]> {
  return [...error_log].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export async function getActivityFeed(): Promise<ActivityEntry[]> {
  return [...activity_feed].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
}

export async function getKpiHistory(): Promise<KpiDataPoint[]> {
  return [...kpi_history].sort((a, b) => a.date.localeCompare(b.date))
}
