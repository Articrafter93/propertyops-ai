/**
 * English translations for the free-text (unique per record) fields of seed.json.
 * Keyed by record id. The Spanish original stays in seed.json (source of truth);
 * this file is consulted only when the active locale is `en`.
 *
 * Enum-like fields (room type, employment, payment type, specialty, scenario) are
 * NOT here — they live as maps in the i18n message catalog (`seedContent`).
 */
import type { Locale } from './config'
import type { Incident, ActivityEntry, Inspection } from '@/lib/types'

const incidentDescription: Record<string, string> = {
  'INC-001': 'Water leak in the bathroom — splashing on the wall from the sink faucet.',
  'INC-002': "The heating system won't turn on. The room is under maintenance but needs repair before re-letting.",
  'INC-003': 'Front door lock hard to turn with the key. The tenant reports it takes several minutes to open.',
  'INC-004': 'Blown bulb at the work desk.',
  'INC-005': 'Small leaks noticed on the ceiling near the window when it rains.',
  'INC-006': 'Low water pressure in the shower.',
}

const activityMessage: Record<string, string> = {
  'ACT-001': 'Contract CONT-005 signed by Ana García',
  'ACT-002': 'New incident INC-005 opened — Ceiling leaks ROOM-201',
  'ACT-003': 'Move-out inspection INSP-002 completed — ROOM-203 (Score: 68)',
  'ACT-004': 'Lead LEAD-005 (Andrés Vidal) auto-approved — Score: 91',
  'ACT-005': 'Rent paid — Carmen Ruiz €750 (ROOM-101)',
  'ACT-006': 'Incident INC-004 resolved — Bulb ROOM-104 (Pedro Sánchez)',
  'ACT-007': 'Move-out process started — Roberto Molina (ROOM-203)',
  'ACT-008': 'New lead received — María Flores Campos (Score: 68)',
}

interface InspectionEn {
  notes: string
  findings: string[]
  billable: string[]
}

const inspection: Record<string, InspectionEn> = {
  'INSP-001': { notes: 'Room in perfect condition. No prior damage. Full inventory.', findings: [], billable: [] },
  'INSP-002': {
    notes: '3 chargeable items detected. Total: €280.',
    findings: ['Dark stain on mattress (right side)', 'Bath towels missing (2 units)', 'Mark on the wall next to the door'],
    billable: ['Mattress — deep cleaning', 'Towels — replacement', 'Paint — wall touch-up'],
  },
  'INSP-003': {
    notes: 'Very good overall condition. Scratch on desk documented as pre-existing.',
    findings: ['Small scratch on desk (pre-existing, documented)'],
    billable: [],
  },
  'INSP-004': { notes: 'Room in good condition. Furniture complete and functional.', findings: [], billable: [] },
}

// Payment notes (free-text, few records)
const paymentNote: Record<string, string> = {
  'Daño colchón (inspección salida)': 'Mattress damage (move-out inspection)',
}

export function enIncidentDescription(inc: Incident, locale: Locale): string {
  return locale === 'en' ? incidentDescription[inc.id] ?? inc.description : inc.description
}

export function enActivityMessage(item: ActivityEntry, locale: Locale): string {
  return locale === 'en' ? activityMessage[item.id] ?? item.message : item.message
}

export function enInspectionNotes(insp: Inspection, locale: Locale): string {
  return locale === 'en' ? inspection[insp.id]?.notes ?? insp.notes : insp.notes
}

export function enInspectionFindings(insp: Inspection, locale: Locale): string[] {
  return locale === 'en' ? inspection[insp.id]?.findings ?? insp.findings : insp.findings
}

export function enBillableItem(insp: Inspection, index: number, fallback: string, locale: Locale): string {
  return locale === 'en' ? inspection[insp.id]?.billable[index] ?? fallback : fallback
}

export function enPaymentNote(note: string | undefined, locale: Locale): string | undefined {
  if (!note) return note
  return locale === 'en' ? paymentNote[note] ?? note : note
}
