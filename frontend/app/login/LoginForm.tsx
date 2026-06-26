'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { signIn } from '@/app/auth/actions'
import { Building2, Loader2, ChevronDown, ShieldCheck, Wrench } from 'lucide-react'

// Demo accounts — sandbox data only, no real credentials
const DEMO_ACCOUNTS = [
  {
    email: 'admin@propertyops.demo',
    password: 'Demo1234!',
    label: 'Administrador',
    sublabel: 'Acceso completo al dashboard',
    destination: '/dashboard',
    icon: ShieldCheck,
    color: '#1a7070',
  },
  {
    email: 'tecnico@propertyops.demo',
    password: 'Demo1234!',
    label: 'Técnico de Mantenimiento',
    sublabel: 'Vista acotada a incidencias',
    destination: '/incidencias',
    icon: Wrench,
    color: '#7c3aed',
  },
]

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null)
  const [email, setEmail] = useState('admin@propertyops.demo')
  const [password, setPassword] = useState('Demo1234!')
  const [selectorOpen, setSelectorOpen] = useState(false)
  const selectorRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setSelectorOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function selectAccount(account: typeof DEMO_ACCOUNTS[0]) {
    setEmail(account.email)
    setPassword(account.password)
    setSelectorOpen(false)
  }

  const selectedAccount = DEMO_ACCOUNTS.find((a) => a.email === email) ?? DEMO_ACCOUNTS[0]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ background: '#1a7070' }}>
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-foreground">PropertyOps</span>
            <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded text-white" style={{ background: '#1a7070' }}>AI</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <h1 className="text-base font-semibold text-foreground mb-1">Iniciar sesión</h1>
          <p className="text-xs text-muted-foreground mb-5">Accede a tu panel de gestión</p>

          {/* Demo account selector */}
          <div className="mb-4 p-3 rounded-lg border border-dashed border-[#1a7070]/40 bg-[#1a7070]/4">
            <p className="text-[10px] font-semibold text-[#1a7070] uppercase tracking-wide mb-2">
              Demo portafolio — selecciona un rol
            </p>
            <div className="relative" ref={selectorRef}>
              <button
                type="button"
                onClick={() => setSelectorOpen((o) => !o)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md border border-border bg-background hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-md shrink-0" style={{ background: selectedAccount.color }}>
                  <selectedAccount.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{selectedAccount.label}</p>
                  <p className="text-[10px] text-muted-foreground truncate">→ {selectedAccount.destination}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${selectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {selectorOpen && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  {DEMO_ACCOUNTS.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => selectAccount(account)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-muted/40 transition-colors text-left"
                    >
                      <div className="flex items-center justify-center w-7 h-7 rounded-md shrink-0" style={{ background: account.color }}>
                        <account.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground">{account.label}</p>
                        <p className="text-[10px] text-muted-foreground">{account.sublabel}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono shrink-0">{account.destination}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form action={action} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#1a7070]/30 focus:border-[#1a7070] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#1a7070]/30 focus:border-[#1a7070] transition-colors"
              />
            </div>

            {state?.error && (
              <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs text-red-700">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-opacity disabled:opacity-60"
              style={{ background: '#1a7070' }}
            >
              {pending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {pending ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          <p className="text-[10px] text-muted-foreground text-center mt-4">
            Datos ficticios — entorno de demostración sandbox
          </p>
        </div>
      </div>
    </div>
  )
}
