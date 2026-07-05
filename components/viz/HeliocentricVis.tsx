'use client'
import { useState } from 'react'

// SVG orbit animation — pure declarative, no JS timers needed.
// Two panels: Geocentric (Ptolemy) on the right, Heliocentric (Aristarchus/Copernicus) on the left.

type Model = 'geo' | 'helio'

const LABELS: Record<Model, { ar: string; en: string; who: string; note: string }> = {
  geo: {
    ar: 'النموذج البطلمي',
    en: 'Geocentric (Ptolemy)',
    who: 'أرسطو · بطليموس',
    note: 'الأرض مركز الكون — الشمس والكواكب تدور حولها',
  },
  helio: {
    ar: 'النموذج الأريسطرخي',
    en: 'Heliocentric (Aristarchus)',
    who: 'أريسطرخس · كوبرنيكوس',
    note: 'الشمس في المركز — الأرض كوكب كسائر الكواكب تدور حولها',
  },
}

function GeocentricSVG() {
  return (
    <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Earth at center */}
      <circle cx="110" cy="110" r="14" fill="#2563eb" />
      <text x="110" y="114" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">🌍</text>

      {/* Moon orbit */}
      <circle cx="110" cy="110" r="28" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
      <circle cx="110" cy="82" r="6" fill="#cbd5e1">
        <animateTransform attributeName="transform" type="rotate"
          from="0 110 110" to="360 110 110" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Sun orbit */}
      <circle cx="110" cy="110" r="54" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
      <circle cx="110" cy="56" r="11" fill="#fbbf24">
        <animateTransform attributeName="transform" type="rotate"
          from="0 110 110" to="360 110 110" dur="8s" repeatCount="indefinite" />
      </circle>
      <text x="110" y="56" textAnchor="middle" fontSize="9" dominantBaseline="middle">☀️</text>
      {/* Need to animate text too */}

      {/* Mars orbit */}
      <circle cx="110" cy="110" r="80" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
      <circle cx="110" cy="30" r="8" fill="#ef4444">
        <animateTransform attributeName="transform" type="rotate"
          from="0 110 110" to="360 110 110" dur="15s" repeatCount="indefinite" />
      </circle>

      {/* Labels */}
      <text x="110" y="127" textAnchor="middle" fontSize="7" fill="#64748b">القمر</text>
      <text x="110" y="212" textAnchor="middle" fontSize="7" fill="#d97706">الشمس</text>
      <text x="110" y="216" textAnchor="middle" fontSize="6" fill="#94a3b8">(تدور حول الأرض)</text>
    </svg>
  )
}

function HeliocentricSVG() {
  return (
    <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" className="w-full">
      {/* Sun at center */}
      <circle cx="110" cy="110" r="16" fill="#fbbf24" />
      <text x="110" y="114" textAnchor="middle" fontSize="10" dominantBaseline="middle">☀️</text>

      {/* Venus orbit */}
      <circle cx="110" cy="110" r="34" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
      <circle cx="110" cy="76" r="7" fill="#d4b483">
        <animateTransform attributeName="transform" type="rotate"
          from="0 110 110" to="360 110 110" dur="5s" repeatCount="indefinite" />
      </circle>

      {/* Earth orbit */}
      <circle cx="110" cy="110" r="56" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
      <g>
        <circle cx="110" cy="54" r="10" fill="#2563eb">
          <animateTransform attributeName="transform" type="rotate"
            from="0 110 110" to="360 110 110" dur="10s" repeatCount="indefinite" />
        </circle>
        {/* Moon around Earth - approximated as separate circle on similar path */}
        <circle cx="110" cy="43" r="5" fill="#cbd5e1" opacity="0.9">
          <animateTransform attributeName="transform" type="rotate"
            from="0 110 110" to="360 110 110" dur="10.9s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Mars orbit */}
      <circle cx="110" cy="110" r="82" fill="none" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="3 2" />
      <circle cx="110" cy="28" r="8" fill="#ef4444">
        <animateTransform attributeName="transform" type="rotate"
          from="0 110 110" to="360 110 110" dur="19s" repeatCount="indefinite" />
      </circle>

      {/* Labels */}
      <text x="110" y="216" textAnchor="middle" fontSize="7" fill="#2563eb">الأرض</text>
      <text x="110" y="212" textAnchor="middle" fontSize="6" fill="#94a3b8">(تدور حول الشمس)</text>
    </svg>
  )
}

export default function HeliocentricVis() {
  const [model, setModel] = useState<Model>('geo')
  const m = LABELS[model]

  return (
    <div className="my-8 rounded-2xl border border-rule bg-surface p-5">
      <p className="text-center text-xs font-semibold text-ink-lt tracking-widest mb-1">
        مَرْكَزُ الكَوْنِ — الأَرْضُ أَمِ الشَّمْسُ؟
      </p>
      <p className="text-center text-xs text-ink-lt mb-5">
        أَرِيسْطَرْخُس (~270 ق.م) أول من قال بمركزية الشمس — قبل كوبرنيكوس بألفي عام
      </p>

      {/* Model selector */}
      <div className="flex justify-center gap-2 mb-5" dir="ltr">
        {(['geo', 'helio'] as Model[]).map((key) => (
          <button
            key={key}
            onClick={() => setModel(key)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              model === key
                ? 'bg-greek text-paper shadow'
                : 'border border-rule text-ink-lt hover:text-ink'
            }`}
          >
            {LABELS[key].ar}
          </button>
        ))}
      </div>

      {/* Animation */}
      <div className="max-w-[220px] mx-auto mb-4">
        {model === 'geo' ? <GeocentricSVG /> : <HeliocentricSVG />}
      </div>

      {/* Info panel */}
      <div className="rounded-xl border border-rule bg-paper px-4 py-3 text-center">
        <p className="text-xs font-bold text-ink mb-0.5">{m.ar}</p>
        <p className="text-xs text-greek mb-1">{m.who}</p>
        <p className="text-xs text-ink-mid leading-relaxed">{m.note}</p>
      </div>

      {/* Aristarchus insight */}
      {model === 'helio' && (
        <p className="mt-3 text-center text-xs text-ink-mid bg-greek/5 border border-greek/20 rounded-lg px-4 py-2">
          استنتج أريسطرخس من قياس زاوية الشمس-القمر-الأرض أن الشمس أكبر من الأرض بكثير — فلا معنى أن يدور الكبير حول الصغير.
        </p>
      )}
    </div>
  )
}
