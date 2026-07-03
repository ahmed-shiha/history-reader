const SCALE = [
  { name: 'دو',   ratio: '1/1',     decimal: 1.000,  bridge: 12, fifth: 0 },
  { name: 'ري',   ratio: '9/8',     decimal: 1.125,  bridge: 10.67, fifth: 2 },
  { name: 'مي',   ratio: '81/64',   decimal: 1.266,  bridge: 9.48,  fifth: 4 },
  { name: 'فا',   ratio: '4/3',     decimal: 1.333,  bridge: 9,    fifth: -1 },
  { name: 'صول',  ratio: '3/2',     decimal: 1.500,  bridge: 8,    fifth: 1 },
  { name: 'لا',   ratio: '27/16',   decimal: 1.688,  bridge: 7.11,  fifth: 3 },
  { name: 'سي',   ratio: '243/128', decimal: 1.898,  bridge: 6.32,  fifth: 5 },
  { name: "دو'",  ratio: '2/1',     decimal: 2.000,  bridge: 6,    fifth: 0 },
]

export default function ScaleBuilder() {
  return (
    <div className="my-8" dir="ltr">
      <p className="text-[0.63rem] font-bold tracking-[0.13em] uppercase text-greek text-center mb-4" dir="rtl">
        السلَّم الفيثاغوري — النسب الكاملة
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" style={{ minWidth: 380 }}>
          <thead>
            <tr>
              <th className="bg-greek/90 text-[#FFF8F0] px-3 py-2 text-right text-[0.6rem] tracking-wider uppercase" dir="rtl">النغمة</th>
              <th className="bg-greek/90 text-[#FFF8F0] px-3 py-2 text-center text-[0.6rem] tracking-wider uppercase">النسبة</th>
              <th className="bg-greek/90 text-[#FFF8F0] px-3 py-2 text-center text-[0.6rem] tracking-wider uppercase">الكسر</th>
              <th className="bg-greek/90 text-[#FFF8F0] px-3 py-2 text-[0.6rem] tracking-wider uppercase" dir="rtl">موضع الجسر / 12</th>
            </tr>
          </thead>
          <tbody>
            {SCALE.map((n, i) => {
              const isOctave = i === 0 || i === 7
              return (
                <tr key={n.name} className={isOctave ? 'bg-greek/[0.07]' : i % 2 === 0 ? 'bg-surface/40' : ''}>
                  <td className={`border border-rule px-3 py-2 text-right font-bold ${isOctave ? 'text-greek' : 'text-ink'}`} dir="rtl">
                    {n.name}
                  </td>
                  <td className="border border-rule px-3 py-2 text-center font-math font-bold text-greek">
                    {n.ratio}
                  </td>
                  <td className="border border-rule px-3 py-2 text-center font-math text-ink-mid">
                    {n.decimal.toFixed(3)}
                  </td>
                  <td className="border border-rule px-3 py-2 pr-3">
                    {/* mini bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4 bg-[#E8E0D4] rounded-sm overflow-hidden relative" style={{ minWidth: 80 }}>
                        <div
                          className="absolute inset-y-0 right-0"
                          style={{
                            width: `${(n.bridge / 12) * 100}%`,
                            background: 'linear-gradient(90deg, rgba(122,75,28,0.55), rgba(200,146,74,0.5))',
                          }}
                        />
                        {/* wire */}
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-ink/30" />
                      </div>
                      <span className="text-[0.6rem] text-ink-lt font-math w-8 text-left">
                        {n.bridge.toFixed(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[0.7rem] text-ink-lt mt-3 text-center" dir="rtl">
        النسبة = طول الجزء المُعزوف ÷ طول الوتر الكامل (12)
      </p>
    </div>
  )
}
