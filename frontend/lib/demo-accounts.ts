// Sandbox demo credentials — not real auth; safe in client bundle per demo-auth exception
export interface DemoAccount {
  email: string
  password: string
  label: string
  sublabel: string
  destination: string
  color: string
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'admin@propertyops.demo',
    password: 'Demo1234!',
    label: 'Administrator',
    sublabel: 'Full dashboard access',
    destination: '/dashboard',
    color: '#1a7070',
  },
  {
    email: 'tecnico@propertyops.demo',
    password: 'Demo1234!',
    label: 'Maintenance Technician',
    sublabel: 'Scoped to incidents',
    destination: '/incidents',
    color: '#7c3aed',
  },
]

export function isValidDemoAccount(email: string, password: string): boolean {
  return DEMO_ACCOUNTS.some((a) => a.email === email && a.password === password)
}
