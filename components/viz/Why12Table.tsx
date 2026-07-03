export default function Why12Table() {
  const rows = [
    { n: 6,  d2: false, d3: false, d4: false },
    { n: 8,  d2: true,  d3: false, d4: true  },
    { n: 9,  d2: false, d3: true,  d4: false },
    { n: 10, d2: true,  d3: false, d4: false },
    { n: 12, d2: true,  d3: true,  d4: true  },
  ]

  return (
    <div className="my-8 overflow-x-auto" dir="ltr">
      <p className="text-[0.65rem] font-bold tracking-[0.14em] uppercase text-greek text-center mb-3" dir="rtl">
        لماذا 12؟ — أصغر عدد يقبل القسمة على 2 و3 و4 معًا
      </p>
      <table className="w-full border-collapse text-sm font-math" style={{ minWidth: 340 }}>
        <thead>
          <tr>
            <th className="bg-greek text-[#FFF8F0] px-4 py-2 text-right text-[0.62rem] tracking-widest uppercase font-bold" dir="rtl">العدد</th>
            <th className="bg-greek text-[#FFF8F0] px-4 py-2 text-center text-[0.62rem] tracking-widest uppercase font-bold">÷ 2</th>
            <th className="bg-greek text-[#FFF8F0] px-4 py-2 text-center text-[0.62rem] tracking-widest uppercase font-bold">÷ 3</th>
            <th className="bg-greek text-[#FFF8F0] px-4 py-2 text-center text-[0.62rem] tracking-widest uppercase font-bold">÷ 4</th>
            <th className="bg-greek text-[#FFF8F0] px-4 py-2 text-center text-[0.62rem] tracking-widest uppercase font-bold">النتيجة</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const win = r.d2 && r.d3 && r.d4
            return (
              <tr key={r.n} className={win ? 'bg-greek/[0.07]' : ''}>
                <td className={`border border-rule px-4 py-2.5 text-right font-bold ${win ? 'text-greek' : 'text-ink-mid'}`} dir="rtl">
                  {r.n}
                </td>
                <td className="border border-rule px-4 py-2.5 text-center">
                  {r.d2
                    ? <span className="text-[#28712A] font-bold">{r.n / 2} ✓</span>
                    : <span className="text-[#B03A2E] font-bold">{(r.n / 2).toFixed(1)} ✗</span>}
                </td>
                <td className="border border-rule px-4 py-2.5 text-center">
                  {r.d3
                    ? <span className="text-[#28712A] font-bold">{r.n / 3} ✓</span>
                    : <span className="text-[#B03A2E] font-bold">{(r.n / 3).toFixed(1)} ✗</span>}
                </td>
                <td className="border border-rule px-4 py-2.5 text-center">
                  {r.d4
                    ? <span className="text-[#28712A] font-bold">{r.n / 4} ✓</span>
                    : <span className="text-[#B03A2E] font-bold">{(r.n / 4).toFixed(1)} ✗</span>}
                </td>
                <td className="border border-rule px-4 py-2.5 text-center text-[0.7rem] font-bold" dir="rtl">
                  {win
                    ? <span className="text-greek">مقبول ✓</span>
                    : <span className="text-[#B03A2E]">مرفوض</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
