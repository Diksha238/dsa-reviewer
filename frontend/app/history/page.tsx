'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, apiHistory } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { History, Calendar, Code2, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'

function getScoreConfig(score: number) {
  if (score >= 8) return { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' }
  if (score >= 5) return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' }
  return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' }
}

function formatDate(d: string) {
  if (!d) return 'N/A'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

interface HistoryItem {
  id: number
  language: string
  score: number
  problemDescription: string
  createdAt: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) { router.push('/'); return }
    apiHistory()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  const avgScore = items.length ? Math.round(items.reduce((a, b) => a + b.score, 0) / items.length) : 0

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-fade-up">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center">
                <History size={16} className="text-accent-light" />
              </div>
              <h1 className="text-2xl font-bold text-white">Review History</h1>
            </div>
            <p className="text-dim text-sm ml-12">Track your progress and revisit past reviews</p>
          </div>
          <Link href="/review"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all"
            style={{ boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}>
            <Plus size={14} /> New Review
          </Link>
        </div>

        {/* Stats */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8 stagger-1 animate-fade-up">
            {[
              { label: 'Total Reviews', value: items.length, color: '#818cf8' },
              { label: 'Average Score', value: `${avgScore}/10`, color: avgScore >= 8 ? '#34d399' : avgScore >= 5 ? '#fbbf24' : '#f87171' },
              { label: 'Languages', value: new Set(items.map(i => i.language)).size, color: '#818cf8' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4">
                <p className="text-dim text-xs mb-1">{label}</p>
                <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex justify-between">
                  <div className="skeleton h-5 w-16 rounded-full" />
                  <div className="skeleton h-10 w-10 rounded-full" />
                </div>
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-24" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <Code2 size={28} className="text-accent/40" />
            </div>
            <h3 className="text-white font-semibold text-lg">No Reviews Yet</h3>
            <p className="text-dim text-sm text-center max-w-xs">Submit your first DSA code review to see it appear here</p>
            <Link href="/review"
              className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all">
              <Plus size={14} /> Start a Review
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-2 animate-fade-up">
            {items.map((item) => {
              const sc = getScoreConfig(item.score)
              return (
                <Link key={item.id} href={`/history/${item.id}`}
                  className="group bg-card border border-border rounded-xl p-5 hover:border-accent/40 transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-surface border border-border text-muted uppercase tracking-wider">
                      {item.language}
                    </span>
                    <div className="w-11 h-11 rounded-xl border-2 flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: sc.border, background: sc.bg }}>
                      <span className="text-base font-bold" style={{ color: sc.color }}>{item.score}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-2">
                    {item.problemDescription || 'Code Review'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-dim">
                      <Calendar size={11} />
                      {formatDate(item.createdAt)}
                    </div>
                    <ChevronRight size={14} className="text-dim group-hover:text-accent-light transition-colors" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
