export default function ThreeMeans() {
  // Range: 6 to 12, total span = 6
  const pct = (v: number) => ((v - 6) / 6) * 100

  const points = [
    { v: 6,     label: '6',  sub: 'البداية',       color: '#1A1008', size: 14 },
    { v: 8,     label: '8',  sub: 'الوسط التوافقي', color: '#7A4B1C', size: 13 },
    { v: 8.485, label: '√72', sub: 'الوسط الهندسي', color: '#26527A', size: 11 },
    { v: 9,     label: '9',  sub: 'الوسط الحسابي',  color: '#5A3E7A', size: 13 },
    { v: 12,    label: '12', sub: 'النهاية',        color: '#1A1008', size: 14 },
  ]

  return (
    <div className="my-8" dir="ltr">
      <p className="text-[0.63rem] font-bold tracking-[0.13em] uppercase text-greek text-center mb-6" dir="rtl">
        الأوساط الثلاثة بين 6 و12
      </p>

      {/* number line */}
      <div className="relative mx-8" style={{ height: 80 }}>
        {/* axis */}
        <div className="absolute top-1/2 inset-x-0 -translate-y-1/2 h-0.5 bg-rule" />

        {points.map((p) => (
          <div
            key={p.v}
            className="absolute"
            style={{ left: `${pct(p.v)}%`, top: '50%', transform: 'translate(-50%,-50%)' }}
          >
            {/* label above */}
            <div
              className="absolute bottom-full mb-2 -translate-x-1/2 font-math font-bold whitespace-nowrap"
              style={{ fontSize: '0.88rem', color: p.color }}
            >
              {p.label}
            </div>
            {/* dot */}
            <div
              className="rounded-full border-2 border-white shadow"
              style={{ width: p.size, height: p.size, background: p.color }}
            />
            {/* sub below */}
            <div
              className="absolute top-full mt-1.5 -translate-x-1/2 text-[0.58rem] whitespace-nowrap text-ink-lt font-tajawal"
              style={{ color: p.color }}
            >
              {p.sub}
            </div>
          </div>
        ))}
      </div>

      {/* legend */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2" dir="rtl">
        {[
          { color: '#7A4B1C', label: 'التوافقي', formula: '2ab/(a+b) = 8' },
          { color: '#26527A', label: 'الهندسي',  formula: '√(ab) ≈ 8.49' },
          { color: '#5A3E7A', label: 'الحسابي',  formula: '(a+b)/2 = 9' },
        ].map((l) => (
          <div key={l.color} className="flex items-center gap-2 text-[0.67rem]">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: l.color }} />
            <span className="font-bold" style={{ color: l.color }}>{l.label}</span>
            <span className="text-ink-lt font-math">{l.formula}</span>
          </div>
        ))}
      </div>

      {/* note: geometric mean rejected */}
      <p className="mt-5 text-center text-[0.72rem] text-ink-lt italic" dir="rtl">
        الوسط الهندسي (√72) أصمُّ — لا يُمكن التعبير عنه بنسبة أعداد صحيحة، فرفضه الفيثاغوريون
      </p>
    </div>
  )
}
