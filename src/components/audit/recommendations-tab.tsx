import type { Recommendation } from '@/types'
import { getPriorityColor } from '@/lib/utils'

const CATEGORY_ICONS: Record<string, string> = {
  technical: '⚙️', onpage: '📝', performance: '⚡',
  content: '✍️', gsc: '📊', advanced: '🚀',
}
const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 }

export function RecommendationsTab({ recs }: { recs: Recommendation[] }) {
  const sorted = [...recs].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])
  const high = sorted.filter(r => r.priority === 'high')
  const medium = sorted.filter(r => r.priority === 'medium')
  const low = sorted.filter(r => r.priority === 'low')

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="Haute" count={high.length} color="text-red-400 bg-red-400/10 border-red-400/20" />
        <SummaryCard label="Moyenne" count={medium.length} color="text-amber-400 bg-amber-400/10 border-amber-400/20" />
        <SummaryCard label="Faible" count={low.length} color="text-blue-400 bg-blue-400/10 border-blue-400/20" />
      </div>
      <div className="space-y-3">
        {sorted.map(rec => <RecCard key={rec.id} rec={rec} />)}
        {sorted.length === 0 && (
          <div className="glass rounded-xl p-10 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="font-semibold text-sm">Aucune recommandation majeure.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className={`rounded-xl p-3 border text-center ${color}`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs mt-0.5 opacity-80">{label}</p>
    </div>
  )
}

function RecCard({ rec }: { rec: Recommendation }) {
  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0">{CATEGORY_ICONS[rec.category] || '💡'}</span>
          <h4 className="font-semibold text-sm">{rec.title}</h4>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full border flex-shrink-0 ${getPriorityColor(rec.priority)}`}>
          {rec.priority === 'high' ? 'Haute' : rec.priority === 'medium' ? 'Moy.' : 'Faible'}
        </span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-2.5">
          <p className="font-medium text-red-400 mb-1">⚠ Problème</p>
          <p className="text-muted-foreground">{rec.problem}</p>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2.5">
          <p className="font-medium text-emerald-400 mb-1">✅ Solution</p>
          <p className="text-muted-foreground">{rec.solution}</p>
        </div>
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-2.5">
          <p className="font-medium text-blue-400 mb-1">📈 Impact</p>
          <p className="text-muted-foreground">{rec.impact}</p>
        </div>
      </div>
    </div>
  )
}
