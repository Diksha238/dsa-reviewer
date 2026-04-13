'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, apiReview } from '@/lib/api'
import Navbar from '@/components/Navbar'
import {
  Send, Code2, ChevronDown, ChevronUp, Clock, Database,
  Tag, AlertTriangle, BookOpen, Zap, Star, FileCode, BarChart3
} from 'lucide-react'

const LANGUAGES = ['Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Kotlin']

const SECTIONS = [
  { key: 'time complexity', label: 'Time Complexity', icon: Clock, color: '#3b82f6' },
  { key: 'space complexity', label: 'Space Complexity', icon: Database, color: '#8b5cf6' },
  { key: 'variable', label: 'Variable Naming', icon: Tag, color: '#f59e0b' },
  { key: 'edge case', label: 'Edge Cases', icon: AlertTriangle, color: '#ef4444' },
  { key: 'readab', label: 'Code Readability', icon: BookOpen, color: '#10b981' },
  { key: 'optim', label: 'Optimizations', icon: Zap, color: '#6366f1' },
]

function getScoreConfig(score: number) {
  if (score >= 8) return { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)', label: 'Excellent' }
  if (score >= 5) return { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)', label: 'Good Attempt' }
  return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', label: 'Needs Work' }
}

function extractSection(feedback: string, keyword: string): string {
  const lines = feedback.split('\n')
  const idx = lines.findIndex(l => l.toLowerCase().includes(keyword.toLowerCase()))
  if (idx === -1) return ''
  const nextHeader = lines.findIndex((l, i) => i > idx + 1 && /^#{1,3}\s/.test(l))
  const chunk = nextHeader === -1 ? lines.slice(idx, idx + 12) : lines.slice(idx, nextHeader)
  return chunk.join('\n').trim()
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
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hupoli])/gm, '')
}

export default function ReviewPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('Java')
  const [problem, setProblem] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ feedback: string; score: number; id: number } | null>(null)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['time complexity']))
  const [activeTab, setActiveTab] = useState<'sections' | 'full'>('sections')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!getToken()) router.push('/')
  }, [router])

  function toggleSection(key: string) {
    setOpenSections(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  async function handleSubmit() {
    if (!code.trim()) { alert('Please paste your code!'); return }
    if (!problem.trim()) { alert('Please add a problem description!'); return }
    setLoading(true)
    setResult(null)
    try {
      const data = await apiReview(code, language, problem)
      setResult(data)
      setOpenSections(new Set(['time complexity']))
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Review failed')
    } finally {
      setLoading(false)
    }
  }

  const scoreConfig = result ? getScoreConfig(result.score) : null

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>

        {/* LEFT — Editor Panel */}
        <div className="w-1/2 flex flex-col border-r border-border">
          {/* Top bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface/50">
            <FileCode size={14} className="text-accent-light" />
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-white font-mono outline-none focus:border-accent cursor-pointer">
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <div className="flex gap-1.5 ml-auto">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
          </div>

          {/* Problem description */}
          <div className="border-b border-border">
            <textarea
              value={problem}
              onChange={e => setProblem(e.target.value)}
              placeholder="Problem: e.g. Two Sum — find indices of two numbers that add up to target"
              className="w-full bg-transparent px-4 py-3 text-sm text-muted placeholder-dim/40 outline-none resize-none font-sans"
              rows={2}
              style={{ lineHeight: 1.6 }}
            />
          </div>

          {/* Code editor */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-surface/30 border-r border-border flex flex-col items-center pt-3 gap-0 overflow-hidden">
              {Array.from({ length: 40 }, (_, i) => (
                <span key={i} className="text-dim/30 text-xs w-full text-center" style={{ fontSize: 11, lineHeight: '22.4px', fontFamily: 'var(--font-jetbrains)' }}>
                  {i + 1}
                </span>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="// Paste your DSA solution here..."
              spellCheck={false}
              className="absolute inset-0 bg-transparent pl-12 pr-4 py-3 text-sm text-slate-300 placeholder-dim/30 outline-none resize-none code-editor"
              style={{ lineHeight: '22.4px' }}
              onKeyDown={e => {
                if (e.key === 'Tab') {
                  e.preventDefault()
                  const start = e.currentTarget.selectionStart
                  const end = e.currentTarget.selectionEnd
                  const newVal = code.substring(0, start) + '  ' + code.substring(end)
                  setCode(newVal)
                  setTimeout(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2 }, 0)
                }
              }}
            />
          </div>

          {/* Submit button */}
          <div className="p-4 border-t border-border bg-surface/30">
            <button onClick={handleSubmit} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all
                disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              style={{
                background: loading ? '#1e1e2e' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                boxShadow: loading ? 'none' : '0 0 24px rgba(99,102,241,0.4)'
              }}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  FANG Interviewer Reviewing...
                </>
              ) : (
                <>
                  <Send size={15} />
                  Review My Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT — Result Panel */}
        <div className="w-1/2 flex flex-col overflow-hidden bg-bg">
          {/* Empty state */}
          {!loading && !result && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-2">
                <Code2 size={28} className="text-accent/50" />
              </div>
              <h3 className="text-white font-semibold text-lg">No Review Yet</h3>
              <p className="text-dim text-sm leading-relaxed max-w-xs">
                Paste your DSA solution, add a problem description, and click "Review My Code" to get FANG-style feedback
              </p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {['Time Complexity', 'Space Complexity', 'Edge Cases', 'Score /10'].map(t => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <Code2 size={24} className="text-accent-light animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold mb-1">Analyzing your code...</p>
                <p className="text-dim text-sm">FANG interviewer reviewing complexity, naming, edge cases</p>
              </div>
              <div className="flex flex-col gap-3 w-72">
                {[80, 60, 70, 50].map((w, i) => (
                  <div key={i} className="skeleton h-3 rounded-full" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="flex-1 overflow-y-auto">
              {/* Score header */}
              <div className="p-5 border-b border-border"
                style={{ background: scoreConfig ? `${scoreConfig.bg}` : 'transparent' }}>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center flex-shrink-0"
                    style={{ borderColor: scoreConfig?.border, background: scoreConfig?.bg }}>
                    <span className="text-3xl font-bold" style={{ color: scoreConfig?.color }}>{result.score}</span>
                    <span className="text-xs" style={{ color: scoreConfig?.color }}>/10</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={14} style={{ color: scoreConfig?.color }} />
                      <span className="font-bold text-white text-lg">{scoreConfig?.label}</span>
                    </div>
                    <p className="text-dim text-sm">FANG-style review complete</p>
                    <div className="flex gap-2 mt-2">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-1.5 w-5 rounded-full transition-all"
                          style={{ background: i < result.score ? scoreConfig?.color : '#1e1e2e' }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border px-4">
                <button onClick={() => setActiveTab('sections')}
                  className={`flex items-center gap-2 py-3 px-1 mr-6 text-xs font-semibold border-b-2 transition-all
                    ${activeTab === 'sections' ? 'border-accent text-accent-light' : 'border-transparent text-dim hover:text-muted'}`}>
                  <BarChart3 size={13} /> Sections
                </button>
                <button onClick={() => setActiveTab('full')}
                  className={`flex items-center gap-2 py-3 px-1 text-xs font-semibold border-b-2 transition-all
                    ${activeTab === 'full' ? 'border-accent text-accent-light' : 'border-transparent text-dim hover:text-muted'}`}>
                  <BookOpen size={13} /> Full Review
                </button>
              </div>

              {/* Section cards */}
              {activeTab === 'sections' && (
                <div className="p-4 space-y-2">
                  {SECTIONS.map(({ key, label, icon: Icon, color }) => {
                    const content = extractSection(result.feedback, key)
                    const isOpen = openSections.has(key)
                    return (
                      <div key={key} className="rounded-xl border border-border overflow-hidden bg-card">
                        <button onClick={() => toggleSection(key)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface/50 transition-colors">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: `${color}18` }}>
                            <Icon size={13} style={{ color }} />
                          </div>
                          <span className="text-sm font-semibold text-white flex-1 text-left">{label}</span>
                          {isOpen ? <ChevronUp size={14} className="text-dim" /> : <ChevronDown size={14} className="text-dim" />}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 border-t border-border pt-3">
                            {content ? (
                              <div className="feedback-content text-sm"
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                            ) : (
                              <p className="text-dim text-sm italic">See full review for details</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Full review */}
              {activeTab === 'full' && (
                <div className="p-4">
                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="feedback-content text-sm"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(result.feedback) }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
