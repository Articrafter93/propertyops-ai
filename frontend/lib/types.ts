export type PropertyStatus = "Active" | "Maintenance" | "Closed";
export type RoomStatus = "Available" | "Occupied" | "Maintenance" | "Cleaning";
export type RoomType = "Individual" | "Doble" | "Suite";
export type TenantStatus = "Active" | "Checkout" | "Archive";
export type LeadStatus = "Auto-Aprobado" | "Revisión Manual" | "Rechazado" | "Contrato Enviado";
export type ContractStatus = "Borrador" | "Firmado" | "Vencido" | "Rescindido";
export type PaymentStatus = "Pagado" | "Pendiente" | "Vencido";
export type PaymentType = "Renta" | "Depósito" | "Cargo" | "Servicio";
export type IncidentPriority = "Baja" | "Media" | "Alta" | "Emergencia";
export type IncidentStatus = "Abierta" | "En Proceso" | "Resuelta" | "Cerrada";
export type InspectionType = "Check-in" | "Check-out";
export type AutomationStatus = "Activo" | "Pausado" | "Error";

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  total_units: number;
  status: PropertyStatus;
  occupancy_rate: number;
}

export interface Room {
  id: string;
  property_id: string;
  number: string;
  type: RoomType;
  price: number;
  status: RoomStatus;
  tenant_id: string | null;
}

export interface Tenant {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  dni: string;
  room_id: string;
  status: TenantStatus;
  move_in_date: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  employment: string;
  monthly_income: number;
  room_price: number;
  income_ratio: number;
  references: number;
  has_guarantor: boolean;
  score: number;
  status: LeadStatus;
  created_at: string;
}

export interface Contract {
  id: string;
  tenant_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  pdf_url: string;
  status: ContractStatus;
}

export interface Payment {
  id: string;
  tenant_id: string;
  amount: number;
  date: string;
  type: PaymentType;
  status: PaymentStatus;
  note?: string;
}

export interface Incident {
  id: string;
  room_id: string;
  tenant_id: string | null;
  description: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  technician_id: string | null;
  sla_hours: number;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface BillableItem {
  item: string;
  qty: number;
  unit_price: number;
  total: number;
}

export interface Inspection {
  id: string;
  room_id: string;
  tenant_id: string | null;
  type: InspectionType;
  date: string;
  ai_score: number;
  findings: string[];
  billable_items: BillableItem[];
  notes: string;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  active: boolean;
  rating: number;
}

export interface KpiDataPoint {
  date: string;
  occupancy_rate: number;
  revenue: number;
  open_incidents: number;
  resolved: number;
}

export interface RevenueDataPoint {
  month: string;
  prop001: number;
  prop002: number;
}

export interface AutomationRun {
  scenario: string;
  scenario_id: string;
  status: AutomationStatus;
  last_run: string;
  next_run: string | null;
  success_rate: number;
  avg_duration_ms: number;
  runs_7d: number;
  errors_7d: number;
}

export interface ErrorLogEntry {
  id: string;
  scenario_id: string;
  scenario: string;
  timestamp: string;
  module: string;
  error: string;
  payload_summary: string;
}

export interface ActivityEntry {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  icon: string;
}
