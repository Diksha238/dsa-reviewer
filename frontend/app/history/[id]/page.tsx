'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getToken, apiReviewById } from '@/lib/api'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Calendar, Code2, Star } from 'lucide-react'
import Link from 'next/link'

function getScoreConfig(score: number) {
  if (score >= 8) return { color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', label: 'Excellent' }
  if (score >= 5) return { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', label: 'Good Attempt' }
  return { color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', label: 'Needs Work' }
}

function renderMarkdown(text: string): string {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n\n/g, '</p><p>')
}

interface ReviewDetail {
  id: number
  language: string
  score: number
  problemDescription: string
  feedback: string
  code: string
  createdAt: string
}

export default function DetailPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState<ReviewDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCode, setShowCode] = useState(false)

  useEffect(() => {
    if (!getToken()) { router.push('/'); return }
    apiReviewById(params.id as string)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [params.id, router])

  const sc = data ? getScoreConfig(data.score) : null

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back */}
        <Link href="/history"
          className="inline-flex items-center gap-2 text-dim text-sm hover:text-white transition-colors mb-8">
          <ArrowLeft size={15} />
          Back to History
        </Link>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            <div className="skeleton h-28 w-full rounded-xl" />
            <div className="skeleton h-96 w-full rounded-xl" />
          </div>
        )}

        {data && sc && (
          <div className="animate-fade-up space-y-5">
            {/* Header card */}
            <div className="rounded-2xl border p-6" style={{ borderColor: sc.border, background: sc.bg }}>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center flex-shrink-0"
                  style={{ borderColor: sc.border, background: 'rgba(0,0,0,0.2)' }}>
                  <span className="text-3xl font-bold" style={{ color: sc.color }}>{data.score}</span>
                  <span className="text-xs" style={{ color: sc.color }}>/10</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={14} style={{ color: sc.color }} />
                    <span className="font-bold text-white text-xl">{sc.label}</span>
                  </div>
                  <h2 className="text-muted text-sm mb-2">{data.problemDescription}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-surface border border-border text-muted uppercase">
                      {data.language}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-dim">
                      <Calendar size={11} />
                      {data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code toggle */}
            {data.code && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <button onClick={() => setShowCode(s => !s)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-surface/50 transition-colors">
                  <Code2 size={14} className="text-accent-light" />
                  <span className="text-sm font-semibold text-white flex-1 text-left">Submitted Code</span>
                  <span className="text-xs text-dim">{showCode ? 'Hide' : 'Show'}</span>
                </button>
                {showCode && (
                  <div className="border-t border-border">
                    <pre className="p-5 overflow-x-auto text-xs text-slate-300 leading-relaxed"
                      style={{ fontFamily: 'var(--font-jetbrains)' }}>
                      <code>{data.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Feedback */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border">
                <Star size={14} className="text-accent-light" />
                <span className="text-sm font-semibold text-white">Full Review</span>
              </div>
              <div className="p-5">
                <div className="feedback-content text-sm"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(data.feedback) }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
