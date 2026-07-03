'use client'
import { useState } from 'react'

const STEPS = [
  {
    title: 'المسألة البابلية',
    body: 'من لوح طيني من عهد سلالة بابل الأولى (نحو ١٨٠٠ ق.م): «مساحة حقل زائد طوله تساوي ٣/٤ بالماتو. ما طوله؟» بلغة اليوم: س² + س = ٣/٤.',
    vis: 'problem',
  },
  {
    title: 'ارسم المجهول',
    body: 'ارسم مربعاً ضلعه س — هذه هي المساحة الأولى. ثم ألصق به مستطيلاً طوله س وعرضه ١ — هذه هي «زائد طوله». المجموع = س² + س = ٣/٤.',
    vis: 'step1',
  },
  {
    title: 'اشطر المستطيل',
    body: 'قسّم المستطيل الجانبي إلى نصفين، كل نصف ½ × س. انقل النصف الثاني إلى أسفل المربع — المنطقة أصبحت حرف L.',
    vis: 'step2',
  },
  {
    title: 'أكمل المربع الكبير',
    body: 'الركن المفقود مربع صغير ضلعه ½. أضفه. المربع الكبير الكامل ضلعه (س + ½)، ومساحته = ٣/٤ + ¼ = ١.',
    vis: 'step3',
  },
  {
    title: 'الحل',
    body: '(س + ½)² = ١، إذن س + ½ = ١، إذن س = ½. البابليون وصلوا إلى هذا بالرسم، قبل أن يكتشف أحد معنى الجبر.',
    vis: 'solution',
  },
]

const SZ = 140, M = 20

function Vis({ step }: { step: string }) {
  const x = M, y = M, s = SZ - M * 2
  // s = side of the main square (represents x)
  const half = s * 0.35   // represents 1/2 addition

  if (step === 'problem') {
    return (
      <svg viewBox={`0 0 ${SZ} ${SZ}`} width={SZ} height={SZ}>
        <text x={SZ / 2} y={SZ / 2 - 10} fontSize={13} fill="#7A4B1C" textAnchor="middle" fontFamily="Georgia,serif">
          س² + س = ¾
        </text>
        <text x={SZ / 2} y={SZ / 2 + 12} fontSize={9} fill="#7A6A58" textAnchor="middle">
          المجهول: س = ؟
        </text>
      </svg>
    )
  }

  const sqSize = s * 0.65
  const rectW = s * 0.28

  if (step === 'step1') {
    return (
      <svg viewBox={`0 0 ${SZ} ${SZ}`} width={SZ} height={SZ}>
        <rect x={M} y={M} width={sqSize} height={sqSize} fill="rgba(122,75,28,0.12)" stroke="#7A4B1C" strokeWidth={1.5} />
        <rect x={M + sqSize} y={M} width={rectW} height={sqSize} fill="rgba(38,82,122,0.12)" stroke="#26527A" strokeWidth={1.5} />
        <text x={M + sqSize / 2} y={M + sqSize / 2 + 4} fontSize={10} fill="#7A4B1C" textAnchor="middle" fontFamily="Georgia,serif">س²</text>
        <text x={M + sqSize + rectW / 2} y={M + sqSize / 2 + 4} fontSize={9} fill="#26527A" textAnchor="middle" fontFamily="Georgia,serif">س</text>
        <text x={M + sqSize / 2} y={M + sqSize + 13} fontSize={8} fill="#7A6A58" textAnchor="middle">س</text>
        <text x={M + sqSize + rectW / 2} y={M + sqSize + 13} fontSize={8} fill="#7A6A58" textAnchor="middle">١</text>
      </svg>
    )
  }

  const halfW = rectW / 2

  if (step === 'step2') {
    return (
      <svg viewBox={`0 0 ${SZ} ${SZ}`} width={SZ} height={SZ}>
        <rect x={M} y={M} width={sqSize} height={sqSize} fill="rgba(122,75,28,0.12)" stroke="#7A4B1C" strokeWidth={1.5} />
        <rect x={M + sqSize} y={M} width={halfW} height={sqSize} fill="rgba(38,82,122,0.14)" stroke="#26527A" strokeWidth={1.5} />
        <rect x={M} y={M + sqSize} width={sqSize} height={halfW} fill="rgba(38,82,122,0.14)" stroke="#26527A" strokeWidth={1.5} strokeDasharray="3,2" />
        <text x={M + sqSize / 2} y={M + sqSize / 2 + 4} fontSize={9} fill="#7A4B1C" textAnchor="middle" fontFamily="Georgia,serif">س²</text>
        <text x={M + sqSize + halfW / 2} y={M + sqSize / 2 + 3} fontSize={8} fill="#26527A" textAnchor="middle">½</text>
        <text x={M + sqSize / 2} y={M + sqSize + halfW / 2 + 3} fontSize={8} fill="#26527A" textAnchor="middle">½</text>
      </svg>
    )
  }

  const total = sqSize + halfW

  if (step === 'step3') {
    return (
      <svg viewBox={`0 0 ${SZ} ${SZ}`} width={SZ} height={SZ}>
        <rect x={M} y={M} width={total} height={total} fill="rgba(122,75,28,0.07)" stroke="#7A4B1C" strokeWidth={2} />
        <rect x={M} y={M} width={sqSize} height={sqSize} fill="rgba(122,75,28,0.10)" stroke="#7A4B1C" strokeWidth={1} />
        <rect x={M + sqSize} y={M} width={halfW} height={sqSize} fill="rgba(38,82,122,0.12)" stroke="#26527A" strokeWidth={1} />
        <rect x={M} y={M + sqSize} width={sqSize} height={halfW} fill="rgba(38,82,122,0.12)" stroke="#26527A" strokeWidth={1} />
        <rect x={M + sqSize} y={M + sqSize} width={halfW} height={halfW} fill="rgba(139,196,116,0.35)" stroke="#5A8C3A" strokeWidth={1.5} />
        <text x={M + sqSize + halfW / 2} y={M + sqSize + halfW / 2 + 3} fontSize={7} fill="#3A6020" textAnchor="middle">+¼</text>
        <text x={M + total / 2} y={M + total + 13} fontSize={8} fill="#7A4B1C" textAnchor="middle" fontFamily="Georgia,serif">(س + ½)</text>
      </svg>
    )
  }

  // solution
  return (
    <svg viewBox={`0 0 ${SZ} ${SZ}`} width={SZ} height={SZ}>
      <rect x={M} y={M} width={total} height={total} fill="rgba(139,196,116,0.20)" stroke="#5A8C3A" strokeWidth={2} />
      <text x={SZ / 2} y={M + total / 2 - 6} fontSize={10} fill="#3A6020" textAnchor="middle" fontFamily="Georgia,serif">(س + ½)² = ١</text>
      <text x={SZ / 2} y={M + total / 2 + 10} fontSize={10} fill="#3A6020" textAnchor="middle" fontFamily="Georgia,serif">س = ½</text>
      <text x={M + total / 2} y={M + total + 13} fontSize={8} fill="#7A6A58" textAnchor="middle">✓</text>
    </svg>
  )
}

export default function GeometricAlgebra() {
  const [step, setStep] = useState(0)
  const s = STEPS[step]

  return (
    <div className="my-6 rounded-sm border border-rule overflow-hidden" dir="rtl">
      <div className="flex flex-col sm:flex-row">
        <div
          className="flex-shrink-0 flex items-center justify-center p-5"
          style={{ background: '#F5EFE5', minWidth: 180 }}
        >
          <Vis step={s.vis} />
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between" style={{ minHeight: 200 }}>
          <div>
            <div className="text-[0.6rem] tracking-[0.14em] font-bold mb-2" style={{ color: '#A08050' }}>
              الخطوة {step + 1} / {STEPS.length}
            </div>
            <div className="text-[0.92rem] font-bold mb-3" style={{ color: '#7A4B1C' }}>{s.title}</div>
            <div className="text-[0.86rem] leading-relaxed" style={{ color: '#2A1A0A', lineHeight: 1.85 }}>{s.body}</div>
          </div>
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setStep(v => Math.max(0, v - 1))}
              disabled={step === 0}
              className="text-[0.78rem] px-3 py-1 rounded-sm border disabled:opacity-25"
              style={{ borderColor: '#D8CEBC', color: '#7A4B1C' }}
            >← السابق</button>
            <button
              onClick={() => setStep(v => Math.min(STEPS.length - 1, v + 1))}
              disabled={step === STEPS.length - 1}
              className="text-[0.78rem] px-3 py-1 rounded-sm border disabled:opacity-25"
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
