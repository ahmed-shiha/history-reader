'use client'
import { useState } from 'react'

const SIZES = [
  { n: 3,  label: 'مثلث',        color: '#E8936A' },
  { n: 4,  label: 'مربع',        color: '#C8924A' },
  { n: 6,  label: 'سداسي',       color: '#A07830' },
  { n: 8,  label: 'ثماني',       color: '#7A5E28' },
  { n: 12, label: 'ثنا عشري',    color: '#5A4420' },
  { n: 24, label: 'رباعي وعشروني', color: '#3A2C16' },
  { n: 96, label: 'ستة وتسعوني',  color: '#1A1008' },
]

function polygonArea(n: number) {
  return (n / 2) * Math.sin((2 * Math.PI) / n)
}

function polygonPoints(n: number, cx: number, cy: number, r: number): string {
  return Array.from({ length: n }, (_, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
}

export default function PolygonExhaustion() {
  const [idx, setIdx] = useState(1)
  const current = SIZES[idx]
  const R = 70, CX = 90, CY = 90
  const pi = Math.PI
  const area = polygonArea(current.n)
  const ratio = (area / pi) * 100

  return (
    <div className="my-6 rounded-sm border border-rule overflow-hidden" dir="rtl">
      <div className="flex flex-col sm:flex-row">
        {/* SVG */}
        <div
          className="flex-shrink-0 flex items-center justify-center p-4"
          style={{ background: '#F5EFE5', minWidth: 200 }}
        >
          <svg viewBox="0 0 180 180" width={180} height={180}>
            {/* Circle */}
            <circle cx={CX} cy={CY} r={R} fill="rgba(38,82,122,0.08)" stroke="#26527A" strokeWidth={1} strokeDasharray="4,2" />
            {/* Polygon */}
            <polygon
              points={polygonPoints(current.n, CX, CY, R)}
              fill={`${current.color}22`}
              stroke={current.color}
              strokeWidth={1.5}
            />
            {/* Center dot */}
            <circle cx={CX} cy={CY} r={2} fill="#7A4B1C" />
            {/* Radius label */}
            <line x1={CX} y1={CY} x2={CX + R} y2={CY} stroke="#7A4B1C" strokeWidth={0.8} strokeDasharray="3,2" opacity={0.5} />
            <text x={CX + R / 2} y={CY - 5} fontSize={8} fill="#7A4B1C" textAnchor="middle" fontFamily="Georgia, serif">r</text>
          </svg>
        </div>

        {/* Controls + data */}
        <div className="flex-1 p-5">
          <div className="text-[0.6rem] tracking-[0.14em] font-bold mb-3" style={{ color: '#A08050' }}>
            شكل منتظم داخل دائرة نصف قطرها ١
          </div>

          {/* Slider */}
          <div className="mb-4">
            <div className="flex justify-between text-[0.72rem] mb-1" style={{ color: '#7A6A58' }}>
              <span>عدد الأضلاع: <strong style={{ color: '#7A4B1C' }}>{current.n}</strong> ({current.label})</span>
            </div>
            <input
              type="range" min={0} max={SIZES.length - 1}
              value={idx}
              onChange={e => setIdx(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: '#7A4B1C' }}
            />
            <div className="flex justify-between text-[0.6rem] mt-0.5" style={{ color: '#A08050' }}>
              {SIZES.map((s, i) => <span key={i}>{s.n}</span>)}
            </div>
          </div>

          {/* Area data */}
          <div className="space-y-2 text-[0.83rem]">
            <div className="flex justify-between" style={{ color: '#3A2A1A' }}>
              <span>مساحة الشكل</span>
              <span className="font-math" dir="ltr">{area.toFixed(5)}</span>
            </div>
            <div className="flex justify-between" style={{ color: '#3A2A1A' }}>
              <span>مساحة الدائرة (π)</span>
              <span className="font-math" dir="ltr">{pi.toFixed(5)}</span>
            </div>
            <div
              className="flex justify-between font-bold pt-1 border-t"
              style={{ borderColor: '#D8CEBC', color: '#7A4B1C' }}
            >
              <span>النسبة المئوية</span>
              <span className="font-math" dir="ltr">{ratio.toFixed(2)}%</span>
            </div>
          </div>

          {/* Bar */}
          <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: '#E8E0D0' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${ratio}%`, background: current.color }}
            />
          </div>

          {idx === SIZES.length - 1 && (
            <div
              className="mt-3 text-[0.78rem] p-2 rounded-sm"
              style={{ background: '#EEF3FA', color: '#26527A', borderRight: '3px solid #7AAED4' }}
            >
              ٩٦ ضلعاً: النسبة ≈ ٩٩.٩٧٪ — هذا ما استخدمه أرخميدس لحساب π بدقة.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
