'use client'
import { useState } from 'react'

// CSS animation is injected once; key-prop remounting restarts it per drop.
const STYLE = `
@keyframes am-fall-fast {
  from { top: 4%; }
  to   { top: 79%; }
}
@keyframes am-fall-slow {
  0%   { top: 4%; }
  60%  { top: 79%; }
  100% { top: 79%; }
}
.am-fast { animation: am-fall-fast 1.8s cubic-bezier(0.25,0.1,0.9,1) forwards; }
.am-slow { animation: am-fall-slow 3.0s cubic-bezier(0.25,0.1,0.9,1) forwards; }
`

export default function AristotleMotion() {
  const [run, setRun] = useState(0)

  const drop = () => setRun((r) => r + 1)
  const reset = () => setRun(0)
  const active = run > 0

  return (
    <div className="my-8 rounded-2xl border border-rule bg-surface p-5">
      <style>{STYLE}</style>

      <p className="text-center text-xs font-semibold text-ink-lt tracking-widest mb-1">
        أَرِسْطُو وَالسُّقُوطُ الحُرُّ — خَطَأٌ عَاشَ أَلْفَيْ عَامٍ
      </p>
      <p className="text-center text-xs text-ink-lt mb-5">
        زعم أرسطو أن الجسم الأثقل يسقط أسرع — وأثبت جاليليو أن كليهما يصلان معاً
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5" dir="ltr">
        {/* ── Aristotle panel ── */}
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-3">
          <p className="text-center text-[11px] font-bold text-red-600 mb-2">
            ❌ نظرية أرسطو
          </p>
          <div
            className="relative rounded-lg bg-white border border-red-100 mx-auto overflow-hidden"
            style={{ height: 180, maxWidth: 140 }}
          >
            {/* Heavy ball */}
            <div
              key={`ah-${run}`}
              className={`absolute rounded-full bg-red-600 flex items-center justify-center text-white font-bold shadow ${active ? 'am-fast' : ''}`}
              style={{ width: 40, height: 40, left: '22%', top: '4%', fontSize: 10 }}
            >
              10 kg
            </div>
            {/* Light ball */}
            <div
              key={`al-${run}`}
              className={`absolute rounded-full bg-red-300 flex items-center justify-center text-white font-bold shadow ${active ? 'am-slow' : ''}`}
              style={{ width: 28, height: 28, left: '62%', top: '4%', fontSize: 9 }}
            >
              1 kg
            </div>
            <div className="absolute bottom-0 inset-x-0 h-2 bg-red-200 rounded-b-lg" />
          </div>
          <p className="text-center text-[11px] text-red-500 mt-1.5 font-medium">
            الأثقل يصل أولاً ⚡
          </p>
        </div>

        {/* ── Galileo / reality panel ── */}
        <div className="rounded-xl border-2 border-green-200 bg-green-50 p-3">
          <p className="text-center text-[11px] font-bold text-green-700 mb-2">
            ✓ الحقيقة — جاليليو
          </p>
          <div
            className="relative rounded-lg bg-white border border-green-100 mx-auto overflow-hidden"
            style={{ height: 180, maxWidth: 140 }}
          >
            {/* Heavy ball */}
            <div
              key={`gh-${run}`}
              className={`absolute rounded-full bg-green-600 flex items-center justify-center text-white font-bold shadow ${active ? 'am-fast' : ''}`}
              style={{ width: 40, height: 40, left: '22%', top: '4%', fontSize: 10 }}
            >
              10 kg
            </div>
            {/* Light ball — same speed */}
            <div
              key={`gl-${run}`}
              className={`absolute rounded-full bg-green-400 flex items-center justify-center text-white font-bold shadow ${active ? 'am-fast' : ''}`}
              style={{ width: 28, height: 28, left: '62%', top: '4%', fontSize: 9 }}
            >
              1 kg
            </div>
            <div className="absolute bottom-0 inset-x-0 h-2 bg-green-200 rounded-b-lg" />
          </div>
          <p className="text-center text-[11px] text-green-600 mt-1.5 font-medium">
            كلاهما يصلان معاً ✓
          </p>
        </div>
      </div>

      {/* Insight shown after first drop */}
      {active && (
        <p className="text-center text-xs text-ink-mid bg-paper border border-rule rounded-lg px-4 py-2 mb-4">
          مقاومة الهواء هي التي تفاوت السرعة — لا الوزن. وفي الفراغ كلاهما يتطابقان تماماً.
        </p>
      )}

      <div className="flex justify-center gap-3">
        <button
          onClick={drop}
          className="px-5 py-2 rounded-lg text-sm font-medium bg-greek text-paper hover:bg-greek/90 transition-colors"
        >
          ↓ أسقِط الكرتين
        </button>
        {run > 0 && (
          <button
            onClick={reset}
            className="px-5 py-2 rounded-lg text-sm font-medium border border-rule text-ink-lt hover:text-ink transition-colors"
          >
            إعادة
          </button>
        )}
      </div>
    </div>
  )
}
