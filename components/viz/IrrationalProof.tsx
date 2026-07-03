'use client'
import { useState } from 'react'

const STEPS = [
  {
    title: 'المربع والضلع',
    body: 'ضع مربعاً ضلعه واحد. هذه البداية الأبسط الممكنة — لا مجال للشك فيها. الضلع ١، والمساحة ١، والزوايا قوائم.',
    highlight: 'square',
  },
  {
    title: 'القطر يُولد √٢',
    body: 'الخط المائل من زاوية إلى زاوية هو قطر المربع. بنظرية فيثاغورس: قطر² = ١² + ١² = ٢، إذن القطر = √٢. هذا الطول موجود بالفعل — يمكنك رسمه.',
    highlight: 'diagonal',
  },
  {
    title: 'الافتراض: هو كسر',
    body: 'لنفترض — لمجرد الاختبار — أن √٢ = أ/ب، حيث أ وب عددان صحيحان موجبان لا قاسم مشترك بينهما. (أي الكسر مختزل تماماً.)',
    highlight: 'fraction',
  },
  {
    title: 'التربيع: أ² = ٢ب²',
    body: 'بتربيع الطرفين: ٢ = أ²/ب²، إذن أ² = ٢ب². مربع أ يساوي ضعف مربع ب. هذا يعني أن أ² عدد زوجي — ولأن مربع الفردي دائماً فردي، فأ نفسه زوجي.',
    highlight: 'even_a',
  },
  {
    title: 'أ = ٢ك، إذن ب زوجي أيضاً',
    body: 'بما أن أ زوجي، اكتب أ = ٢ك. بالتعويض: (٢ك)² = ٢ب²، أي ٤ك² = ٢ب²، أي ب² = ٢ك². إذن ب² زوجي، وبالتالي ب زوجي.',
    highlight: 'even_b',
  },
  {
    title: 'التناقض — الكسر يتكسّر',
    body: 'كلٌّ من أ وب زوجي — وهذا يناقض الافتراض أنهما لا يشتركان في قاسم مشترك! الاستنتاج الوحيد: الافتراض باطل من الأساس. √٢ ليست كسراً بأي صورة.',
    highlight: 'contradiction',
  },
]

export default function IrrationalProof() {
  const [step, setStep] = useState(0)
  const s = STEPS[step]
  const W = 150, H = 150
  const M = 22, SQ = W - M * 2

  return (
    <div className="my-6 rounded-sm overflow-hidden border border-rule" dir="rtl">
      <div className="flex flex-col sm:flex-row">
        <div
          className="flex-shrink-0 flex items-center justify-center p-5"
          style={{ background: '#F5EFE5', minWidth: 180 }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            {/* Square */}
            <rect
              x={M} y={M} width={SQ} height={SQ}
              fill={s.highlight === 'contradiction' ? 'rgba(122,28,28,0.06)' : 'rgba(122,75,28,0.06)'}
              stroke={s.highlight === 'contradiction' ? '#7A1C1C' : '#7A4B1C'}
              strokeWidth={s.highlight === 'square' ? 2.5 : 1.5}
            />
            {/* Side labels */}
            <text x={W / 2} y={H - 5} fontSize={9} fill="#7A6A58" textAnchor="middle" fontFamily="Georgia, serif">1</text>
            <text x={7} y={H / 2 + 4} fontSize={9} fill="#7A6A58" textAnchor="middle" fontFamily="Georgia, serif">1</text>
            {/* Right angle mark */}
            <polyline
              points={`${M},${H - M - 9} ${M + 9},${H - M - 9} ${M + 9},${H - M}`}
              fill="none" stroke="#7A4B1C" strokeWidth={1} opacity={0.5}
            />
            {/* Diagonal */}
            {step >= 1 && (
              <line
                x1={M} y1={H - M} x2={W - M} y2={M}
                stroke={s.highlight === 'contradiction' ? '#7A1C1C' : '#26527A'}
                strokeWidth={s.highlight === 'diagonal' ? 2.5 : 1.8}
                strokeDasharray={step === 1 ? '4,2' : undefined}
              />
            )}
            {step >= 1 && step < 5 && (
              <text
                x={W / 2 + 8} y={H / 2 - 8}
                fontSize={11} fill="#26527A" textAnchor="middle"
                fontFamily="Georgia, serif" fontStyle="italic"
                transform={`rotate(-45,${W / 2 + 8},${H / 2 - 8})`}
              >√2</text>
            )}
            {/* Contradiction */}
            {step === 5 && (
              <>
                <line x1={M + 6} y1={M + 6} x2={W - M - 6} y2={H - M - 6} stroke="#7A1C1C" strokeWidth={1.5} opacity={0.35} />
                <line x1={W - M - 6} y1={M + 6} x2={M + 6} y2={H - M - 6} stroke="#7A1C1C" strokeWidth={1.5} opacity={0.35} />
                <text x={W / 2} y={H / 2 + 5} fontSize={22} fill="#7A1C1C" textAnchor="middle" opacity={0.5}>✕</text>
              </>
            )}
            {/* Fraction annotation */}
            {step === 2 && (
              <text x={W / 2} y={H - M + 14} fontSize={8.5} fill="#26527A" textAnchor="middle" fontFamily="Georgia, serif">
                √2 = أ/ب ؟
              </text>
            )}
          </svg>
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between" style={{ minHeight: 195 }}>
          <div>
            <div
              className="text-[0.6rem] tracking-[0.14em] font-bold uppercase mb-2"
              style={{ color: '#A08050' }}
            >
              خطوة {step + 1} من {STEPS.length}
            </div>
            <div className="text-[0.92rem] font-bold mb-3" style={{ color: '#7A4B1C' }}>
              {s.title}
            </div>
            <div className="text-[0.87rem] leading-relaxed" style={{ color: '#2A1A0A', lineHeight: 1.85 }}>
              {s.body}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setStep(v => Math.max(0, v - 1))}
              disabled={step === 0}
              className="text-[0.78rem] px-3 py-1 rounded-sm border disabled:opacity-25 transition-opacity"
              style={{ borderColor: '#D8CEBC', color: '#7A4B1C' }}
            >← السابق</button>
            <button
              onClick={() => setStep(v => Math.min(STEPS.length - 1, v + 1))}
              disabled={step === STEPS.length - 1}
              className="text-[0.78rem] px-3 py-1 rounded-sm border disabled:opacity-25 transition-opacity"
              style={{ borderColor: '#D8CEBC', color: '#7A4B1C' }}
            >التالي →</button>
            <div className="flex gap-1.5 mr-auto">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: i === step ? '#7A4B1C' : '#D8CEBC',
                    border: 'none', cursor: 'pointer', padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
