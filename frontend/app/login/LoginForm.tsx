'use client'

import { useActionState } from 'react'
import { signIn } from '@/app/auth/actions'
import { Building2, Loader2 } from 'lucide-react'

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, null)

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

          <form action={action} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue="admin@propertyops.demo"
                placeholder="admin@propertyops.demo"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#1a7070]/30 focus:border-[#1a7070] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                defaultValue="Demo1234!"
                placeholder="••••••••"
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

          <div className="mt-4 px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
            <p className="text-[10px] text-muted-foreground text-center">
              Demo: <span className="font-mono">admin@propertyops.demo</span> / <span className="font-mono">Demo1234!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
