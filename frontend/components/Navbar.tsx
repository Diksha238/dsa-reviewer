'use client'
import { useRouter, usePathname } from 'next/navigation'
import { clearToken, getUser } from '@/lib/api'
import { Code2, History, LogOut, User } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const router = useRouter()
  const path = usePathname()
  const user = getUser()

  function logout() {
    clearToken()
    router.push('/')
  }

  return (
    <nav className="h-14 bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-50 flex items-center justify-between px-6">
      <Link href="/review" className="flex items-center gap-2.5 group">
        <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
          <Code2 size={14} className="text-accent-light" />
        </div>
        <span className="font-bold text-white text-sm tracking-tight">DSA Reviewer</span>
      </Link>

      <div className="flex items-center gap-1">
        <Link href="/review"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${path === '/review' ? 'bg-accent/15 text-accent-light' : 'text-dim hover:text-muted hover:bg-border'}`}>
          <Code2 size={13} />
          Review
        </Link>
        <Link href="/history"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
            ${path === '/history' || path.startsWith('/history') ? 'bg-accent/15 text-accent-light' : 'text-dim hover:text-muted hover:bg-border'}`}>
          <History size={13} />
          History
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 text-xs text-dim">
            <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
              <User size={11} className="text-accent-light" />
            </div>
            <span className="hidden sm:block">{user.name}</span>
          </div>
        )}
        <button onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-dim hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </nav>
  )
}
