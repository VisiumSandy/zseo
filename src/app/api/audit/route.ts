import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { connectDB, Audit } from '@/lib/db'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  const { url, gscSiteUrl, competitorUrl, crawlDepth = 1, targetLang = 'fr', device = 'mobile', targetKeyword } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL manquante' }, { status: 400 })
  await connectDB()
  const audit = await Audit.create({
    userId: session.user.id, url, status: 'pending',
    targetKeyword, targetLang, device, crawlDepth,
  })
  runAudit(audit._id.toString(), url, session.user.id, { gscSiteUrl, competitorUrl, crawlDepth, targetLang, device, targetKeyword }).catch(console.error)
  return NextResponse.json({ auditId: audit._id.toString() })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  await connectDB()
  const audits = await Audit.find({ userId: session.user.id }).sort({ createdAt: -1 }).limit(20).lean()
  return NextResponse.json({ audits: audits.map((a: any) => ({ ...a, id: a._id.toString() })) })
}

interface AuditOptions {
  gscSiteUrl?: string
  competitorUrl?: string
  crawlDepth: number
  targetLang: string
  device: string
  targetKeyword?: string
}

async function runAudit(auditId: string, url: string, userId: string, opts: AuditOptions) {
  await connectDB()
  await Audit.findByIdAndUpdate(auditId, { status: 'running' })
  try {
    const { analyzeOnPage, analyzeTechnical, calculateScores, generateRecommendations, generateChecklist, analyzeCompetitor } =
      await import('@/lib/seo-analyzer')
    const { fetchGSCData } = await import('@/lib/gsc')
    const { analyzeUrl, analyzeImagePerformance, detectTechStack, analyzeEEAT, analyzeKeyword, crawlPages } =
      await import('@/lib/advanced-analyzer')

    // TOUT en parallèle pour gagner du temps
    const axiosLib = (await import('axios')).default

    const [technical, onPage, htmlResponse] = await Promise.all([
      analyzeTechnical(url),
      analyzeOnPage(url),
      axiosLib.get(url, { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } }).catch(() => null),
    ])

    const html = htmlResponse?.data || ''
    const responseHeaders = htmlResponse
      ? Object.fromEntries(Object.entries(htmlResponse.headers).map(([k, v]) => [k, String(v)]))
      : {}

    // Analyses avancées + GSC + concurrent en parallèle
    const [gscData, competitorData, eeatScore, crawlResults] = await Promise.all([
      opts.gscSiteUrl ? fetchGSCData(userId, opts.gscSiteUrl).catch(() => null) : Promise.resolve(null),
      opts.competitorUrl ? analyzeCompetitor(opts.competitorUrl).catch(() => null) : Promise.resolve(null),
      html ? analyzeEEAT(url, html).catch(() => null) : Promise.resolve(null),
      opts.crawlDepth > 1 ? crawlPages(url, Math.min(opts.crawlDepth, 3)).catch(() => []) : Promise.resolve([]),
    ])

    const urlAnalysis = analyzeUrl(url, opts.targetKeyword)
    const imagePerformance = html ? analyzeImagePerformance(html) : null
    const techStack = html ? detectTechStack(html, responseHeaders) : null
    const keywordAnalysis = (html && opts.targetKeyword) ? analyzeKeyword(html, url, opts.targetKeyword) : null

    const scoreBreakdown = calculateScores(technical, onPage, !!gscData?.available)
    const recommendations = generateRecommendations(technical, onPage, gscData)
    const checklist = generateChecklist(technical, onPage)

    await Audit.findByIdAndUpdate(auditId, {
      status: 'completed',
      score: scoreBreakdown.total,
      scoreBreakdown,
      technicalData: technical,
      onPageData: onPage,
      gscData,
      recommendations,
      checklist,
      competitorData,
      urlAnalysis,
      imagePerformance,
      techStack,
      eeatScore,
      keywordAnalysis,
      crawlResults,
      completedAt: new Date(),
    })
  } catch (err) {
    console.error('Audit failed:', err)
    await Audit.findByIdAndUpdate(auditId, { status: 'failed' })
  }
}
