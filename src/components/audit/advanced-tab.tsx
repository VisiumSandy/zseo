'use client'
import type { UrlAnalysis, ImagePerformance, TechStack, EEATScore, KeywordAnalysis, CrawlPageResult } from '@/types'

export function AdvancedTab({ data }: {
  data: {
    urlAnalysis?: UrlAnalysis | null
    imagePerformance?: ImagePerformance | null
    techStack?: TechStack | null
    eeatScore?: EEATScore | null
    keywordAnalysis?: KeywordAnalysis | null
    crawlResults?: CrawlPageResult[] | null
  }
}) {
  return (
    <div className="space-y-6">
      {/* URL Analysis */}
      {data.urlAnalysis && <UrlAnalysisCard data={data.urlAnalysis} />}

      {/* Keyword */}
      {data.keywordAnalysis && <KeywordCard data={data.keywordAnalysis} />}

      {/* Tech Stack */}
      {data.techStack && <TechStackCard data={data.techStack} />}

      {/* E-E-A-T */}
      {data.eeatScore && <EEATCard data={data.eeatScore} />}

      {/* Images */}
      {data.imagePerformance && <ImagePerfCard data={data.imagePerformance} />}

      {/* Crawl */}
      {data.crawlResults && data.crawlResults.length > 0 && <CrawlCard data={data.crawlResults} />}

      {!data.urlAnalysis && !data.techStack && !data.eeatScore && (
        <div className="glass rounded-xl p-10 text-center">
          <p className="text-4xl mb-3">🔬</p>
          <p className="text-muted-foreground">Aucune analyse avancée disponible pour cet audit.</p>
          <p className="text-sm text-muted-foreground mt-2">Relancez un audit pour obtenir toutes les analyses avancées.</p>
        </div>
      )}
    </div>
  )
}

function UrlAnalysisCard({ data }: { data: UrlAnalysis }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-semibold mb-4">🔗 Analyse de l'URL</h3>
      <div className="bg-secondary/50 rounded-lg px-4 py-2 font-mono text-sm text-primary mb-4 break-all">{data.url}</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Check label="URL propre" passed={data.isClean} />
        <Check label="Tirets (-) utilisés" passed={data.usesHyphens} />
        <Check label="Pas de majuscules" passed={!data.hasUpperCase} />
        <Check label="Pas d'underscores (_)" passed={!data.hasUnderscores} />
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Longueur URL</p>
          <p className={`font-bold text-lg ${data.length < 75 ? 'text-emerald-400' : data.length < 115 ? 'text-amber-400' : 'text-red-400'}`}>{data.length} car.</p>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Profondeur</p>
          <p className={`font-bold text-lg ${data.depth <= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>{data.depth} niveau{data.depth > 1 ? 'x' : ''}</p>
        </div>
        {data.hasKeyword !== undefined && (
          <Check label="Mot-clé dans l'URL" passed={data.hasKeyword} />
        )}
      </div>
    </div>
  )
}

function KeywordCard({ data }: { data: KeywordAnalysis }) {
  const score = [data.inTitle, data.inH1, data.inMetaDescription, data.inUrl, data.inFirstParagraph].filter(Boolean).length
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-semibold mb-1">🎯 Analyse du mot-clé cible</h3>
      <p className="text-sm text-cyan-400 font-medium mb-4">"{data.keyword}"</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <Check label="Dans le Title" passed={data.inTitle} />
        <Check label="Dans le H1" passed={data.inH1} />
        <Check label="Dans la meta description" passed={data.inMetaDescription} />
        <Check label="Dans l'URL" passed={data.inUrl} />
        <Check label="Dans le 1er paragraphe" passed={data.inFirstParagraph} />
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Densité</p>
          <p className={`font-bold text-lg ${data.density > 3 ? 'text-red-400' : data.density > 0.5 ? 'text-emerald-400' : 'text-amber-400'}`}>{data.density}%</p>
          <p className="text-xs text-muted-foreground">{data.occurrences} occurrence(s)</p>
        </div>
      </div>
      {data.recommendations.length > 0 && (
        <div className="space-y-2">
          {data.recommendations.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-amber-400 flex-shrink-0">💡</span>
              <span className="text-muted-foreground">{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TechStackCard({ data }: { data: TechStack }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-semibold mb-4">🛠️ Technologies détectées</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <TechItem label="CMS" value={data.cms} />
        <TechItem label="Framework" value={data.framework} />
        <TechItem label="E-commerce" value={data.ecommerce} />
        <TechItem label="CDN" value={data.cdn} />
        <TechItem label="Chatbot" value={data.chatbot} />
        <div className="bg-secondary/50 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-2">Analytics</p>
          {data.analytics.length > 0
            ? data.analytics.map(a => <span key={a} className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded mr-1">{a}</span>)
            : <span className="text-xs text-muted-foreground">Non détecté</span>
          }
        </div>
      </div>
      {data.detected.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Toutes les technologies ({data.detected.length})</p>
          <div className="flex flex-wrap gap-1.5">
            {data.detected.map(t => (
              <span key={t} className="text-xs bg-secondary px-2 py-1 rounded-md border border-border">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EEATCard({ data }: { data: EEATScore }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">⭐ Score E-E-A-T</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Experience · Expertise · Authority · Trust</p>
        </div>
        <div className="text-right">
          <span className={`text-3xl font-black ${data.score>=70?'text-emerald-400':data.score>=40?'text-amber-400':'text-red-400'}`}>{data.score}</span>
          <span className="text-muted-foreground text-sm">/100</span>
        </div>
      </div>
      <div className="w-full bg-secondary rounded-full h-2 mb-5">
        <div className={`h-2 rounded-full ${data.score>=70?'bg-emerald-500':data.score>=40?'bg-amber-500':'bg-red-500'}`} style={{width:`${data.score}%`}} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-emerald-400 mb-2">✅ Points validés</p>
          <div className="space-y-1.5">
            {data.details.map((d, i) => (
              <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span>{d}
              </p>
            ))}
            {data.details.length === 0 && <p className="text-xs text-muted-foreground italic">Aucun signal E-E-A-T détecté</p>}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-red-400 mb-2">❌ À améliorer</p>
          <div className="space-y-1.5">
            {data.missing.slice(0, 5).map((m, i) => (
              <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                <span className="text-red-400">✗</span>{m}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ImagePerfCard({ data }: { data: ImagePerformance }) {
  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-semibold mb-4">🖼️ Performance des images</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Metric label="Total images" value={data.totalImages.toString()} status="ok" />
        <Metric label="Format WebP" value={`${data.webpCount}/${data.totalImages}`} status={data.webpCount === data.totalImages ? 'ok' : 'warn'} />
        <Metric label="Lazy loading" value={`${data.lazyLoadCount}/${data.totalImages}`} status={data.lazyLoadCount >= data.totalImages - 2 ? 'ok' : 'warn'} />
        <Metric label="Sans ALT" value={data.withoutAlt.toString()} status={data.withoutAlt === 0 ? 'ok' : 'error'} />
      </div>
      {data.recommendations.length > 0 && (
        <div className="space-y-2">
          {data.recommendations.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-sm bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2">
              <span className="text-amber-400">⚠</span>
              <span className="text-muted-foreground">{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CrawlCard({ data }: { data: CrawlPageResult[] }) {
  const issues = data.flatMap(p => p.issues.map(i => ({ url: p.url, issue: i })))
  const notFound = data.filter(p => p.statusCode === 404)

  return (
    <div className="glass rounded-xl p-5">
      <h3 className="font-semibold mb-1">🕷️ Crawl multi-pages ({data.length} pages)</h3>
      <p className="text-xs text-muted-foreground mb-4">
        {data.filter(p => p.statusCode === 200).length} OK · {notFound.length} 404 · {issues.length} problèmes
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left pb-2">Page</th>
              <th className="text-center pb-2">Status</th>
              <th className="text-center pb-2">Mots</th>
              <th className="text-left pb-2">Problèmes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((page, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="py-2 pr-3 max-w-[200px] truncate font-mono text-muted-foreground">
                  /{page.url.replace(/^https?:\/\/[^/]+\/?/, '')}
                </td>
                <td className="py-2 text-center">
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${page.statusCode === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {page.statusCode || '?'}
                  </span>
                </td>
                <td className="py-2 text-center text-muted-foreground">{page.wordCount}</td>
                <td className="py-2">
                  <div className="flex flex-wrap gap-1">
                    {page.issues.slice(0, 2).map((iss, j) => (
                      <span key={j} className="bg-amber-500/10 text-amber-400 text-xs px-1.5 py-0.5 rounded">{iss}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Check({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className={`rounded-lg p-3 border ${passed ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
      <div className="flex items-center gap-2">
        <span className={passed ? 'text-emerald-400' : 'text-red-400'}>{passed ? '✓' : '✗'}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
    </div>
  )
}

function TechItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-sm font-medium ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
        {value || 'Non détecté'}
      </p>
    </div>
  )
}

function Metric({ label, value, status }: { label: string; value: string; status: 'ok'|'warn'|'error' }) {
  const c = { ok: 'text-emerald-400', warn: 'text-amber-400', error: 'text-red-400' }
  return (
    <div className="bg-secondary/50 rounded-lg p-3 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-xl font-bold ${c[status]}`}>{value}</p>
    </div>
  )
}
