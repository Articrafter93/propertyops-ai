export type UserRole = 'admin' | 'tecnico';

// Demo email → role mapping (sandbox only; never use real credentials here)
const DEMO_ROLE_MAP: Record<string, UserRole> = {
  'admin@propertyops.demo': 'admin',
  'tecnico@propertyops.demo': 'tecnico',
};

// Technician ID assigned to the demo tecnico account
export const DEMO_TECNICO_ID = 'TEC-001';

export function getRole(email?: string | null): UserRole {
  if (!email) return 'admin';
  return DEMO_ROLE_MAP[email] ?? 'admin';
}

// Routes the tecnico role is allowed to access
const TECNICO_ALLOWED = ['/incidents'];

export function isPathAllowed(role: UserRole, pathname: string): boolean {
  if (role === 'admin') return true;
  return TECNICO_ALLOWED.some((p) => pathname.startsWith(p));
}
