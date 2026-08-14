'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

// Key is date-scoped so it resets automatically each new day
function todayKey() {
  return `reading-timer:${new Date().toISOString().slice(0, 10)}`
}

function loadSeconds(): number {
  try {
    const v = localStorage.getItem(todayKey())
    return v ? parseInt(v, 10) : 0
  } catch {
    return 0
  }
}

function persist(s: number) {
  try {
    localStorage.setItem(todayKey(), String(s))
  } catch {}
}

function fmt(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  if (h > 0) return `${h}:${mm}:${ss}`
  return `${mm}:${ss}`
}

export default function ReadingTimer() {
  const [secs, setSecs] = useState(0)
  const [running, setRunning] = useState(false)
  const tick = useRef<ReturnType<typeof setInterval> | null>(null)

  // Hydrate from localStorage once on mount
  useEffect(() => {
    setSecs(loadSeconds())
  }, [])

  const stop = useCallback(() => {
    if (tick.current) {
      clearInterval(tick.current)
      tick.current = null
    }
    setRunning(false)
  }, [])

  const go = useCallback(() => {
    if (tick.current) return
    tick.current = setInterval(() => {
      setSecs((prev) => {
        const next = prev + 1
        persist(next)
        return next
      })
    }, 1000)
    setRunning(true)
  }, [])

  const toggle = useCallback(() => {
    if (running) stop()
    else go()
  }, [running, stop, go])

  // Clean up interval on unmount
  useEffect(() => () => { if (tick.current) clearInterval(tick.current) }, [])

  return (
    <button
      onClick={toggle}
      title={running ? 'إيقاف مؤقت للمؤقِّت' : 'ابدأ مؤقِّت القراءة'}
      aria-label={`مؤقت القراءة اليومي: ${fmt(secs)} — ${running ? 'قيد التشغيل' : 'موقوف'}`}
      className={[
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all select-none',
        'font-mono text-sm tabular-nums',
        running
          ? 'text-greek bg-greek-light ring-1 ring-greek/30'
          : 'text-ink-mid hover:text-greek hover:bg-greek-light',
      ].join(' ')}
    >
      {/* play / pause icon */}
      <span className="text-[11px] leading-none" aria-hidden="true">
        {running ? '⏸' : '▶'}
      </span>
      {/* time display */}
      <span>{fmt(secs)}</span>
    </button>
  )
}
