'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface ProgressRecord {
  id: string
  date: string
  book_slug: string
  chapter_slug: string
  book_title: string
  chapter_title: string
  words_read: number
  scroll_pct: number
  updated_at: string
}

interface DayStat {
  date: string
  words: number
  chapters: ProgressRecord[]
}

function toArabicDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-EG', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function formatNum(n: number) {
  return n.toLocaleString('ar-EG')
}

function streak(days: DayStat[]): number {
  const today = new Date().toISOString().slice(0, 10)
  let count = 0
  let cursor = today
  const dateSet = new Set(days.filter(d => d.words > 0).map(d => d.date))
  while (dateSet.has(cursor)) {
    count++
    const d = new Date(cursor)
    d.setDate(d.getDate() - 1)
    cursor = d.toISOString().slice(0, 10)
  }
  return count
}

function BarChart({ days }: { days: DayStat[] }) {
  const today = new Date().toISOString().slice(0, 10)
  const maxWords = Math.max(...days.map(d => d.words), 1)
  const BAR_W = 28
  const GAP = 6
  const H = 140
  const LABEL_H = 32
  const totalW = days.length * (BAR_W + GAP) - GAP

  return (
    <div className="overflow-x-auto">
      <svg
        width={totalW}
        height={H + LABEL_H}
        className="block mx-auto"
        style={{ minWidth: totalW }}
      >
        {days.map((day, i) => {
          const x = i * (BAR_W + GAP)
          const barH = Math.max(4, Math.round((day.words / maxWords) * H))
          const y = H - barH
          const isToday = day.date === today
          const hasReading = day.words > 0
          return (
            <g key={day.date}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={BAR_W}
                height={barH}
                rx={4}
                style={{
                  fill: isToday
                    ? 'rgb(var(--greek))'
                    : hasReading
                    ? 'rgb(var(--greek) / 0.45)'
                    : 'rgb(var(--rule) / 0.5)',
                }}
              />
              {/* Word count above bar */}
              {hasReading && (
                <text
                  x={x + BAR_W / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize={9}
                  style={{ fill: 'rgb(var(--ink-lt))', fontFamily: 'inherit' }}
                >
                  {day.words >= 1000
                    ? `${(day.words / 1000).toFixed(1)}k`
                    : day.words}
                </text>
              )}
              {/* Day label */}
              <text
                x={x + BAR_W / 2}
                y={H + LABEL_H - 6}
                textAnchor="middle"
                fontSize={9}
                style={{
                  fill: isToday
                    ? 'rgb(var(--greek))'
                    : 'rgb(var(--ink-lt))',
                  fontWeight: isToday ? 700 : 400,
                  fontFamily: 'inherit',
                }}
              >
                {new Date(day.date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric' })}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function StatsPage() {
  const [records, setRecords] = useState<ProgressRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reading-progress?days=30')
      .then(r => r.json())
      .then(d => {
        setRecords(d.records ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Group records by date
  const byDate = new Map<string, DayStat>()
  for (const r of records) {
    const existing = byDate.get(r.date)
    if (existing) {
      existing.words += r.words_read
      existing.chapters.push(r)
    } else {
      byDate.set(r.date, { date: r.date, words: r.words_read, chapters: [r] })
    }
  }

  // Build 30-day array (newest last for chart)
  const chartDays: DayStat[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().slice(0, 10)
    chartDays.push(byDate.get(iso) ?? { date: iso, words: 0, chapters: [] })
  }

  const today = new Date().toISOString().slice(0, 10)
  const todayStat = byDate.get(today)
  const allDays = Array.from(byDate.values())
  const totalAllTime = allDays.reduce((s, d) => s + d.words, 0)
  const currentStreak = streak(allDays)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/" className="text-sm text-ink-lt hover:text-greek transition-colors">
          ← الرئيسية
        </Link>
        <h1 className="text-2xl font-bold text-ink mt-3">تقدُّم القراءة</h1>
      </div>

      {loading ? (
        <p className="text-ink-lt text-center py-20">جارٍ التحميل…</p>
      ) : (
        <>
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-surface border border-rule rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-greek">
                {formatNum(todayStat?.words ?? 0)}
              </p>
              <p className="text-xs text-ink-lt mt-1">كلمة اليوم</p>
            </div>
            <div className="bg-surface border border-rule rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-ink">
                {currentStreak}
                <span className="text-lg mr-1">🔥</span>
              </p>
              <p className="text-xs text-ink-lt mt-1">أيام متتالية</p>
            </div>
            <div className="bg-surface border border-rule rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-ink">
                {totalAllTime >= 1000
                  ? `${Math.round(totalAllTime / 1000)}k`
                  : formatNum(totalAllTime)}
              </p>
              <p className="text-xs text-ink-lt mt-1">إجمالي الكلمات</p>
            </div>
          </div>

          {/* 30-day chart */}
          <div className="bg-surface border border-rule rounded-xl p-5 mb-6">
            <h2 className="text-sm font-bold text-ink mb-4">آخر ٣٠ يوماً</h2>
            <BarChart days={chartDays} />
          </div>

          {/* Today's sessions */}
          <div className="bg-surface border border-rule rounded-xl p-5 mb-6">
            <h2 className="text-sm font-bold text-ink mb-4">
              جلسات اليوم
              {todayStat && (
                <span className="text-ink-lt font-normal mr-2">
                  — {formatNum(todayStat.words)} كلمة
                </span>
              )}
            </h2>
            {!todayStat || todayStat.chapters.length === 0 ? (
              <p className="text-sm text-ink-lt text-center py-4">لا توجد جلسات اليوم بعد</p>
            ) : (
              <ul className="space-y-2">
                {todayStat.chapters.map(r => (
                  <li key={r.id} className="flex items-center justify-between gap-3 py-2 border-b border-rule/50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm text-ink font-medium truncate">{r.chapter_title}</p>
                      <p className="text-xs text-ink-lt truncate">{r.book_title}</p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="text-sm font-bold text-greek">{formatNum(r.words_read)} كلمة</p>
                      <p className="text-xs text-ink-lt">{Math.round(r.scroll_pct * 100)}٪</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Recent days list */}
          <div className="bg-surface border border-rule rounded-xl p-5">
            <h2 className="text-sm font-bold text-ink mb-4">السجل الأخير</h2>
            {allDays.length === 0 ? (
              <p className="text-sm text-ink-lt text-center py-4">لا توجد بيانات بعد</p>
            ) : (
              <ul className="space-y-1">
                {[...allDays]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 14)
                  .map(day => (
                    <li key={day.date} className="flex items-center justify-between py-2 border-b border-rule/50 last:border-0">
                      <span className="text-sm text-ink-mid">{toArabicDate(day.date)}</span>
                      <span className="text-sm font-bold text-ink">{formatNum(day.words)} كلمة</span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
