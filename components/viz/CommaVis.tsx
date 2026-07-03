export default function CommaVis() {
  // 12 fifths vs 7 octaves
  const fifthsResult  = Math.pow(3 / 2, 12)
  const octavesResult = Math.pow(2, 7)
  const comma = fifthsResult / octavesResult

  // generate spiral points for 12 fifths
  const N = 12
  const cx = 120, cy = 120, r0 = 20, rStep = 7
  const points = Array.from({ length: N + 1 }).map((_, i) => {
    const angle = (i / N) * 2 * Math.PI * 1.5 - Math.PI / 2
    const r = r0 + i * rStep
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  const start = points[0]
  const end   = points[N]

  return (
    <div className="my-8" dir="rtl">
      <p className="text-[0.63rem] font-bold tracking-[0.13em] uppercase text-greek text-center mb-4">
        الفارق الفيثاغوري — لماذا لا تُغلق الدائرة؟
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
        {/* spiral SVG */}
        <svg width={240} height={240} viewBox="0 0 240 240" className="flex-shrink-0">
          <path d={pathD} fill="none" stroke="#D8CEBC" strokeWidth={1.5} />
          <path d={pathD} fill="none" stroke="#7A4B1C" strokeWidth={2} strokeDasharray="none" opacity={0.7} />

          {/* start point */}
          <circle cx={start.x} cy={start.y} r={5} fill="#1A1008" />
          <text x={start.x + 8} y={start.y + 4} fontSize={9} fill="#1A1008" fontFamily="system-ui">دو (البداية)</text>

          {/* end point — slightly off from start */}
          <circle cx={end.x} cy={end.y} r={5} fill="#B03A2E" />
          <text x={end.x + 8} y={end.y + 4} fontSize={9} fill="#B03A2E" fontFamily="system-ui">دو (بعد 12 خُمسًا)</text>

          {/* gap line */}
          <line
            x1={start.x} y1={start.y}
            x2={end.x}   y2={end.y}
            stroke="#B03A2E" strokeWidth={1.5} strokeDasharray="3,3"
          />

          {/* arrows along spiral */}
          {[2, 5, 8, 11].map((i) => {
            const p = points[i], q = points[i + 1]
            const dx = q.x - p.x, dy = q.y - p.y
            const len = Math.sqrt(dx * dx + dy * dy)
            const mx = p.x + dx * 0.6, my = p.y + dy * 0.6
            return (
              <polygon
                key={i}
                points={`${mx},${my} ${mx - (dy / len) * 5 - (dx / len) * 4},${my + (dx / len) * 5 - (dy / len) * 4} ${mx + (dy / len) * 5 - (dx / len) * 4},${my - (dx / len) * 5 - (dy / len) * 4}`}
                fill="#7A4B1C"
              />
            )
          })}
        </svg>

        {/* calculation box */}
        <div className="bg-surface border border-rule rounded p-4 text-sm max-w-xs w-full" dir="ltr">
          <div className="text-[0.6rem] font-bold tracking-wider uppercase text-greek mb-3" dir="rtl">الحساب</div>

          <div className="space-y-2 font-math text-ink">
            <div className="flex justify-between items-baseline gap-4">
              <span className="text-ink-lt text-[0.7rem]">12 خُمسًا صاعدًا:</span>
              <span className="font-bold">(3/2)¹² = {fifthsResult.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-baseline gap-4">
              <span className="text-ink-lt text-[0.7rem]">7 أوكتافات نازلة:</span>
              <span className="font-bold">2⁷ = {octavesResult}</span>
            </div>
            <div className="border-t border-rule my-2" />
            <div className="flex justify-between items-baseline gap-4">
              <span className="text-ink-lt text-[0.7rem]">الفارق:</span>
              <span className="font-bold text-[#B03A2E]">{comma.toFixed(5)}</span>
            </div>
            <div className="flex justify-between items-baseline gap-4">
              <span className="text-ink-lt text-[0.7rem]">كسر:</span>
              <span className="font-bold text-[#B03A2E]">531441/524288</span>
            </div>
          </div>

          <p className="text-[0.68rem] text-ink-lt mt-3 leading-relaxed" dir="rtl">
            الفارق ≈ ربع نصف توقف — صغير لكنَّه يجعل التدوير المثالي على جميع النغمات مستحيلًا
          </p>
        </div>
      </div>
    </div>
  )
}
