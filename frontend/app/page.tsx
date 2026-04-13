'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiLogin, apiRegister, getToken } from '@/lib/api'
import { Code2, Terminal, Zap, Shield, Eye, EyeOff } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  useEffect(() => {
    if (getToken()) router.push('/review')
  }, [router])

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'login') {
        await apiLogin(form.email, form.password)
      } else {
        if (!form.name.trim()) throw new Error('Name is required')
        await apiRegister(form.name, form.email, form.password)
      }
      router.push('/review')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl"
        style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-up">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Code2 size={20} className="text-accent-light" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">DSA Reviewer</span>
          </div>
          <p className="text-dim text-sm">FANG-style code analysis powered by AI</p>
        </div>

        {/* Features row */}
        <div className="grid grid-cols-3 gap-3 mb-8 stagger-1 animate-fade-up">
          {[
            { icon: Terminal, label: 'Deep Analysis' },
            { icon: Zap, label: 'Instant Review' },
            { icon: Shield, label: 'FANG Standard' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface border border-border">
              <Icon size={16} className="text-accent-light" />
              <span className="text-xs text-dim font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden stagger-2 animate-fade-up"
          style={{ boxShadow: '0 0 40px rgba(99,102,241,0.08)' }}>
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-all capitalize
                  ${tab === t ? 'text-accent-light border-b-2 border-accent bg-accent/5' : 'text-dim hover:text-muted'}`}>
                {t}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-dim uppercase tracking-widest mb-2">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-dim/50 outline-none focus:border-accent transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-dim/50 outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-dim uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface border border-border rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder-dim/50 outline-none focus:border-accent transition-colors"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dim hover:text-muted transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all
                bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-[0.98]"
              style={{ boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {tab === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-dim text-xs mt-6">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            className="text-accent-light hover:underline">
            {tab === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
