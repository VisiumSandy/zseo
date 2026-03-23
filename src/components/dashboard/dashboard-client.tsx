'use client'
import Link from 'next/link'
import { getScoreColor } from '@/lib/utils'
import { NewAuditForm } from '@/components/audit/new-audit-form'

interface RecentAudit {
  id: string; url: string; status: string; score: number | null
  createdAt: Date; completedAt: Date | null
}

export function DashboardClient({ recentAudits, userName }: { recentAudits: RecentAudit[]; userName: string }) {
  const completed = recentAudits.filter(a => a.status === 'completed')
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((s, a) => s + (a.score || 0), 0) / completed.length)
    : null

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl md:text-2xl font-bold">Bonjour, {userName.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground mt-1 text-sm">Analysez votre SEO et découvrez les opportunités de croissance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Audits" value={recentAudits.length.toString()} icon="📊" />
        <StatCard label="Score moy." value={avgScore ? `${avgScore}/100` : '—'} icon="⭐" />
        <StatCard label="Ce mois" value={recentAudits.filter(a => {
          const d = new Date(a.createdAt); const now = new Date()
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        }).length.toString()} icon="📅" />
      </div>

      {/* Form + History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-sm md:text-base">🔍 Lancer un audit</h2>
          <NewAuditForm />
        </div>
        <div className="glass rounded-2xl p-5">
          <h2 className="font-semibold mb-4 text-sm md:text-base">📋 Audits récents</h2>
          {recentAudits.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucun audit lancé pour l'instant.</p>
          ) : (
            <div className="space-y-1.5">
              {recentAudits.slice(0, 6).map(audit => <AuditRow key={audit.id} audit={audit} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="glass rounded-xl p-3 md:p-5">
      <div className="text-xl md:text-2xl mb-1">{icon}</div>
      <div className="text-lg md:text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  )
}

function AuditRow({ audit }: { audit: RecentAudit }) {
  const statusColors: Record<string, string> = {
    completed: 'bg-emerald-500/20 text-emerald-400',
    running: 'bg-blue-500/20 text-blue-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    failed: 'bg-red-500/20 text-red-400',
  }
  const statusLabels: Record<string, string> = {
    completed: 'OK', running: '...', pending: 'Att.', failed: 'Err.'
  }
  return (
    <Link href={`/dashboard/audit/${audit.id}`}
      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-secondary/50 transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
          {audit.url.replace(/^https?:\/\//, '')}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date(audit.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </div>
      <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
        {audit.score !== null && (
          <span className={`text-sm font-bold ${getScoreColor(audit.score)}`}>{audit.score}</span>
        )}
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[audit.status] || ''}`}>
          {statusLabels[audit.status] || audit.status}
        </span>
      </div>
    </Link>
  )
}
