const SOLIDS = [
  {
    ar: 'رباعي الوجوه',
    en: 'Tetrahedron',
    symbol: '△',
    faceType: 'مثلث ٦٠°',
    v: 4, e: 6, f: 4,
    perV: 3, angleSum: 180,
    element: 'النار 🔥',
    elementColor: 'text-amber-700 bg-amber-50',
    dual: 'رباعي الوجوه',
    selfDual: true,
  },
  {
    ar: 'المكعب',
    en: 'Cube',
    symbol: '□',
    faceType: 'مربع ٩٠°',
    v: 8, e: 12, f: 6,
    perV: 3, angleSum: 270,
    element: 'التراب 🟫',
    elementColor: 'text-stone-700 bg-stone-50',
    dual: 'ثماني الوجوه',
    selfDual: false,
  },
  {
    ar: 'ثماني الوجوه',
    en: 'Octahedron',
    symbol: '◇',
    faceType: 'مثلث ٦٠°',
    v: 6, e: 12, f: 8,
    perV: 4, angleSum: 240,
    element: 'الهواء 💨',
    elementColor: 'text-sky-700 bg-sky-50',
    dual: 'المكعب',
    selfDual: false,
  },
  {
    ar: 'اثنا عشري الوجوه',
    en: 'Dodecahedron',
    symbol: '⬠',
    faceType: 'خماسي ١٠٨°',
    v: 20, e: 30, f: 12,
    perV: 3, angleSum: 324,
    element: 'الكون ✦',
    elementColor: 'text-violet-700 bg-violet-50',
    dual: 'عشروني الوجوه',
    selfDual: false,
  },
  {
    ar: 'عشروني الوجوه',
    en: 'Icosahedron',
    symbol: '▽',
    faceType: 'مثلث ٦٠°',
    v: 12, e: 30, f: 20,
    perV: 5, angleSum: 300,
    element: 'الماء 💧',
    elementColor: 'text-blue-700 bg-blue-50',
    dual: 'اثنا عشري الوجوه',
    selfDual: false,
  },
]

const ANGLE_ROWS = [
  { shape: 'مثلث', deg: 60, count: 3, sum: 180, ok: true,  result: 'رباعي الوجوه' },
  { shape: 'مثلث', deg: 60, count: 4, sum: 240, ok: true,  result: 'ثماني الوجوه' },
  { shape: 'مثلث', deg: 60, count: 5, sum: 300, ok: true,  result: 'عشروني الوجوه' },
  { shape: 'مثلث', deg: 60, count: 6, sum: 360, ok: false, result: 'مسطّح (بلاط سداسي)' },
  { shape: 'مربع',  deg: 90, count: 3, sum: 270, ok: true,  result: 'المكعب' },
  { shape: 'مربع',  deg: 90, count: 4, sum: 360, ok: false, result: 'مسطّح (بلاط مربع)' },
  { shape: 'خماسي', deg: 108, count: 3, sum: 324, ok: true,  result: 'اثنا عشري الوجوه' },
  { shape: 'خماسي', deg: 108, count: 4, sum: 432, ok: false, result: 'مستحيل (٤٣٢° > ٣٦٠°)' },
  { shape: 'سداسي', deg: 120, count: 3, sum: 360, ok: false, result: 'مسطّح (بلاط النحل)' },
]

export default function PlatonicSolidsVis() {
  return (
    <div className="my-8 space-y-10" dir="rtl">

      {/* Section 1: Properties table */}
      <div>
        <p className="text-xs font-semibold text-ink-lt uppercase tracking-widest mb-3">
          الخصائص الأساسية والمميّز الطوبولوجي
        </p>
        <div className="overflow-x-auto rounded-xl border border-rule">
          <table className="w-full text-sm font-variant-numeric-tabular">
            <thead>
              <tr className="bg-surface border-b border-rule text-ink-lt text-xs">
                <th className="px-4 py-3 text-right font-semibold">المجسّم</th>
                <th className="px-3 py-3 text-center font-semibold">نوع الوجه</th>
                <th className="px-3 py-3 text-center font-semibold">ر (رؤوس)</th>
                <th className="px-3 py-3 text-center font-semibold">ض (أضلاع)</th>
                <th className="px-3 py-3 text-center font-semibold">و (وجوه)</th>
                <th className="px-3 py-3 text-center font-semibold bg-greek/5 text-greek">ر−ض+و</th>
                <th className="px-3 py-3 text-center font-semibold">العنصر</th>
              </tr>
            </thead>
            <tbody>
              {SOLIDS.map((s, i) => (
                <tr key={s.en} className={`border-b border-rule/60 ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ink">{s.ar}</div>
                    <div className="text-xs text-ink-lt">{s.en}</div>
                  </td>
                  <td className="px-3 py-3 text-center text-ink-mid">{s.faceType}</td>
                  <td className="px-3 py-3 text-center font-mono text-ink">{s.v}</td>
                  <td className="px-3 py-3 text-center font-mono text-ink">{s.e}</td>
                  <td className="px-3 py-3 text-center font-mono text-ink">{s.f}</td>
                  <td className="px-3 py-3 text-center bg-greek/5">
                    <span className="font-mono font-bold text-greek">
                      {s.v}−{s.e}+{s.f} = <span className="text-lg">٢</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.elementColor}`}>
                      {s.element}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink-lt mt-2 text-center">
          ر−ض+و = ٢ لكل متعدد وجوه محدّب — مميّز أويلر الطوبولوجي الثابت
        </p>
      </div>

      {/* Section 2: Angle constraint proof */}
      <div>
        <p className="text-xs font-semibold text-ink-lt uppercase tracking-widest mb-3">
          لماذا خمسة فحسب؟ — استنفاد الاحتمالات بالشرط الزاوي
        </p>
        <div className="overflow-x-auto rounded-xl border border-rule">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface border-b border-rule text-ink-lt text-xs">
                <th className="px-4 py-3 text-right font-semibold">نوع الوجه</th>
                <th className="px-3 py-3 text-center font-semibold">الزاوية</th>
                <th className="px-3 py-3 text-center font-semibold">عدد الوجوه في الرأس</th>
                <th className="px-3 py-3 text-center font-semibold">مجموع الزوايا</th>
                <th className="px-3 py-3 text-center font-semibold">أقل من ٣٦٠°؟</th>
                <th className="px-3 py-3 text-right font-semibold">النتيجة</th>
              </tr>
            </thead>
            <tbody>
              {ANGLE_ROWS.map((r, i) => (
                <tr key={i} className={`border-b border-rule/60 ${r.ok ? '' : 'opacity-60'}`}>
                  <td className="px-4 py-2.5 text-ink-mid">{r.shape}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-ink">{r.deg}°</td>
                  <td className="px-3 py-2.5 text-center font-mono text-ink">{r.count}</td>
                  <td className="px-3 py-2.5 text-center font-mono text-ink">
                    {r.count}×{r.deg}° = <strong>{r.sum}°</strong>
                  </td>
                  <td className="px-3 py-2.5 text-center text-lg">
                    {r.ok ? (
                      <span className="text-emerald-600">✓</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </td>
                  <td className={`px-4 py-2.5 text-sm font-medium ${r.ok ? 'text-emerald-700' : 'text-red-600 line-through'}`}>
                    {r.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink-lt mt-2 text-center">
          الشرط: مجموع الزوايا عند كل رأس يجب أن يكون أقل تماماً من ٣٦٠° — وإلا مُسطَّح أو مستحيل
        </p>
      </div>

      {/* Section 3: Duality */}
      <div>
        <p className="text-xs font-semibold text-ink-lt uppercase tracking-widest mb-3">
          الثنائية — كل مجسّم يختبئ داخل مقابله
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              a: 'رباعي الوجوه',
              b: 'رباعي الوجوه',
              note: 'ثنائي نفسه — الوحيد من بين الخمسة',
              color: 'border-amber-300 bg-amber-50/50',
              arrow: '↔ ذاته',
            },
            {
              a: 'المكعب',
              b: 'ثماني الوجوه',
              note: 'الرؤوس ↔ الوجوه — الأضلاع ثابتة (١٢)',
              color: 'border-stone-300 bg-stone-50/50',
              arrow: '↔',
            },
            {
              a: 'اثنا عشري الوجوه',
              b: 'عشروني الوجوه',
              note: 'الرؤوس ↔ الوجوه — الأضلاع ثابتة (٣٠)',
              color: 'border-violet-300 bg-violet-50/50',
              arrow: '↔',
            },
          ].map((pair) => (
            <div key={pair.a} className={`rounded-xl border-2 p-4 text-center ${pair.color}`}>
              <div className="font-bold text-ink text-sm">{pair.a}</div>
              <div className="my-2 text-xl text-ink-lt font-light">{pair.arrow}</div>
              <div className="font-bold text-ink text-sm">{pair.b}</div>
              <div className="mt-3 text-xs text-ink-lt leading-relaxed">{pair.note}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
