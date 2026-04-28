import { createClient } from '@supabase/supabase-js'
import type {
  Property, Room, Tenant, Lead, Contract, Payment,
  Incident, Inspection, Technician, AutomationRun,
  ErrorLogEntry, ActivityEntry, KpiDataPoint,
} from './types'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

// ── Helpers ────────────────────────────────────────────────

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase.from('properties').select('*')
  if (error) throw error
  return data as Property[]
}

export async function getRooms(): Promise<Room[]> {
  const { data, error } = await supabase.from('rooms').select('*')
  if (error) throw error
  return data as Room[]
}

export async function getTenants(): Promise<Tenant[]> {
  const { data, error } = await supabase.from('tenants').select('*')
  if (error) throw error
  return data as Tenant[]
}

export async function getTenant(id: string): Promise<Tenant | null> {
  const { data, error } = await supabase.from('tenants').select('*').eq('id', id).single()
  if (error) return null
  return data as Tenant
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map((r) => ({ ...r, references: r.num_references })) as Lead[]
}

export async function getContracts(): Promise<Contract[]> {
  const { data, error } = await supabase.from('contracts').select('*')
  if (error) throw error
  return data as Contract[]
}

export async function getPayments(tenantId?: string): Promise<Payment[]> {
  let q = supabase.from('payments').select('*').order('date', { ascending: false })
  if (tenantId) q = q.eq('tenant_id', tenantId)
  const { data, error } = await q
  if (error) throw error
  return data as Payment[]
}

export async function getIncidents(): Promise<Incident[]> {
  const { data, error } = await supabase.from('incidents').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as Incident[]
}

export async function getInspections(): Promise<Inspection[]> {
  const { data, error } = await supabase.from('inspections').select('*').order('date', { ascending: false })
  if (error) throw error
  return data as Inspection[]
}

export async function getInspection(id: string): Promise<Inspection | null> {
  const { data, error } = await supabase.from('inspections').select('*').eq('id', id).single()
  if (error) return null
  return data as Inspection
}

export async function getTechnicians(): Promise<Technician[]> {
  const { data, error } = await supabase.from('technicians').select('*')
  if (error) throw error
  return data as Technician[]
}

export async function getAutomationRuns(): Promise<AutomationRun[]> {
  const { data, error } = await supabase.from('automation_runs').select('*')
  if (error) throw error
  return data as AutomationRun[]
}

export async function getErrorLogs(): Promise<ErrorLogEntry[]> {
  const { data, error } = await supabase.from('error_logs').select('*').order('timestamp', { ascending: false })
  if (error) throw error
  return data as ErrorLogEntry[]
}

export async function getActivityFeed(): Promise<ActivityEntry[]> {
  const { data, error } = await supabase.from('activity_feed').select('*').order('timestamp', { ascending: false })
  if (error) throw error
  return data as ActivityEntry[]
}

export async function getKpiHistory(): Promise<KpiDataPoint[]> {
  const { data, error } = await supabase.from('kpi_history').select('*').order('date', { ascending: true })
  if (error) throw error
  return data as KpiDataPoint[]
}
