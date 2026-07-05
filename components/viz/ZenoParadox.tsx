'use client'
import { useState, useEffect, useRef } from 'react'

const MAX_STEPS = 9

export default function ZenoParadox() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // position = 1 - (1/2)^step  →  converges to 1
  const pos = step === 0 ? 0 : 1 - Math.pow(0.5, step)

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setStep((s) => {
          if (s >= MAX_STEPS) { setPlaying(false); return s }
          return s + 1
        })
      }, 750)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [playing])

  const reset = () => { setStep(0); setPlaying(false) }
  const toggle = () => {
    if (step >= MAX_STEPS) { reset(); return }
    setPlaying((p) => !p)
  }

  // Build sum string: ½ + ¼ + ⅛ + …
  const termLabels = ['½', '¼', '⅛', '1/16', '1/32', '1/64']
  const shownTerms = termLabels.slice(0, Math.min(step, 6))
  const sumLabel = shownTerms.join(' + ') + (step > 6 ? ' + …' : '')

  return (
    <div className="my-8 rounded-2xl border border-rule bg-surface p-5">
      <p className="text-center text-xs font-semibold text-ink-lt tracking-widest mb-1">
        مُتَنَاقَضَةُ زِينُون — السَّاعِي الَّذِي لَا يَبْلُغُ الغَايَةَ
      </p>
      <p className="text-center text-xs text-ink-lt mb-5">
        "يجب أن تقطع نصف المسافة أولاً، ثم نصف الباقي، وهكذا إلى ما لا نهاية — فلن تصل!"
      </p>

      {/* Running track */}
      <div className="relative h-14 rounded-xl bg-paper border border-rule mb-3 overflow-hidden">
        {/* Bisection markers */}
        {Array.from({ length: step }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-greek/25"
            style={{ left: `${(1 - Math.pow(0.5, i + 1)) * 86 + 5}%` }}
          />
        ))}
        {/* Progress fill */}
        <div
          className="absolute inset-y-0 left-0 bg-greek/10 transition-all duration-700"
          style={{ width: `${pos * 86 + 5}%` }}
        />
        {/* Runner emoji */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-2xl transition-all duration-700 select-none"
          style={{ left: `${pos * 86 + 5}%` }}
        >
          🏃
        </div>
        {/* Finish line */}
        <div className="absolute top-0 bottom-0 right-[9%] border-r-2 border-dashed border-green-500/70" />
        <span className="absolute top-2 right-[4%] text-xs text-green-600 font-semibold">الغاية</span>
        {/* Start */}
        <span className="absolute top-2 left-2 text-xs text-ink-lt">البداية</span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-2 bg-paper rounded-full border border-rule overflow-hidden">
          <div
            className="h-full bg-greek transition-all duration-700"
            style={{ width: `${pos * 100}%` }}
          />
        </div>
        <span className="text-xs font-mono text-ink min-w-[4rem]" dir="ltr">
          {(pos * 100).toFixed(2)}%
        </span>
      </div>

      {/* Convergent sum */}
      {step > 0 && (
        <div
          className="text-center text-xs font-mono text-ink-mid bg-paper rounded-lg border border-rule px-3 py-2 mb-4"
          dir="ltr"
        >
          {sumLabel}
          {' = '}
          <span className="font-bold text-ink">{pos.toFixed(5)}</span>
          {step >= MAX_STEPS && (
            <span className="text-green-600 font-bold ml-2">→ ١.٠٠٠٠٠ ✓</span>
          )}
        </div>
      )}

      {/* Aristotle's resolution */}
      {step >= MAX_STEPS && (
        <p className="text-center text-xs text-ink-mid bg-greek/10 border border-greek/20 rounded-lg px-4 py-2 mb-4">
          ردّ أرسطو: "المرء يقطع خطواتٍ لا نهاية لها في زمانٍ محدود — والمجموع يعود إلى واحد صحيح."
        </p>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-2">
        <button
          onClick={toggle}
          className="px-4 py-1.5 rounded-lg text-sm font-medium bg-greek text-paper hover:bg-greek/90 transition-colors"
        >
          {step >= MAX_STEPS
            ? 'أعِد من البداية'
            : playing
            ? '⏸ توقف'
            : step === 0
            ? '▶ ابدأ'
            : '▶ استمر'}
        </button>
        {step > 0 && step < MAX_STEPS && !playing && (
          <button
            onClick={reset}
            className="px-4 py-1.5 rounded-lg text-sm text-ink-lt border border-rule hover:text-ink transition-colors"
          >
            إعادة
          </button>
        )}
      </div>
    </div>
  )
}
