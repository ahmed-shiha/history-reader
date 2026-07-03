const DIVISORS_60 = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]
const DIVISORS_10 = [1, 2, 5, 10]
const DIVISORS_12 = [1, 2, 3, 4, 6, 12]

const ALL = Array.from({ length: 60 }, (_, i) => i + 1)

const PLACE_VALUES = [
  { power: 3, value: 216000, label: '60³', ar: 'مئتا ألف وستة عشر ألفاً' },
  { power: 2, value: 3600,   label: '60²', ar: 'ثلاثة آلاف وستمئة' },
  { power: 1, value: 60,     label: '60¹', ar: 'ستون' },
  { power: 0, value: 1,      label: '60⁰', ar: 'واحد' },
]

export default function SexagesimalVis() {
  return (
    <div className="my-6 space-y-6" dir="rtl">
      {/* Divisor grid */}
      <div>
        <div className="text-[0.62rem] font-bold tracking-[0.12em] mb-3" style={{ color: '#A08050' }}>
          الأعداد من ١ إلى ٦٠ — قواسم العدد ستين مُعلَّمة
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
          {ALL.map(n => {
            const is60 = DIVISORS_60.includes(n)
            const is10 = DIVISORS_10.includes(n)
            return (
              <div
                key={n}
                className="text-center py-1 rounded-sm text-[0.65rem] font-math"
                style={{
                  background: is60 && is10
                    ? '#5A8C3A'
                    : is60
                    ? '#C8924A'
                    : '#EDE8E0',
                  color: is60 ? '#FFF8EE' : '#7A6A58',
                  fontWeight: is60 ? 700 : 400,
                }}
              >
                {n}
              </div>
            )
          })}
        </div>
        <div className="flex gap-4 mt-2 text-[0.68rem]" style={{ color: '#7A6A58' }}>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 inline-block rounded-sm" style={{ background: '#C8924A' }}></span>
            قاسم ٦٠ فقط ({DIVISORS_60.length} قاسماً)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 inline-block rounded-sm" style={{ background: '#5A8C3A' }}></span>
            قاسم ٦٠ و١٠ معاً
          </span>
        </div>
      </div>

      {/* Comparison table */}
      <div>
        <div className="text-[0.62rem] font-bold tracking-[0.12em] mb-2" style={{ color: '#A08050' }}>
          مقارنة القواسم: ٦٠ مقابل ١٠ مقابل ١٢
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[0.8rem] border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid #D8CEBC' }}>
                <th className="text-right py-2 pr-3 font-bold" style={{ color: '#7A4B1C' }}>القاعدة</th>
                <th className="text-right py-2 font-bold" style={{ color: '#7A4B1C' }}>القواسم</th>
                <th className="text-center py-2 font-bold" style={{ color: '#7A4B1C' }}>العدد</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #EDE8E0' }}>
                <td className="py-2 pr-3" style={{ color: '#3A2A1A' }}>قاعدة <strong>٦٠</strong></td>
                <td className="py-2 font-math" style={{ color: '#7A4B1C', direction: 'ltr', textAlign: 'left' }}>
                  {DIVISORS_60.join('، ')}
                </td>
                <td className="py-2 text-center font-bold" style={{ color: '#7A4B1C' }}>١٢</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #EDE8E0' }}>
                <td className="py-2 pr-3" style={{ color: '#3A2A1A' }}>قاعدة <strong>١٢</strong></td>
                <td className="py-2 font-math" style={{ color: '#26527A', direction: 'ltr', textAlign: 'left' }}>
                  {DIVISORS_12.join('، ')}
                </td>
                <td className="py-2 text-center font-bold" style={{ color: '#26527A' }}>٦</td>
              </tr>
              <tr>
                <td className="py-2 pr-3" style={{ color: '#3A2A1A' }}>قاعدة <strong>١٠</strong></td>
                <td className="py-2 font-math" style={{ color: '#8A6A50', direction: 'ltr', textAlign: 'left' }}>
                  {DIVISORS_10.join('، ')}
                </td>
                <td className="py-2 text-center font-bold" style={{ color: '#8A6A50' }}>٤</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className="mt-3 text-[0.78rem] p-3 rounded-sm"
          style={{ background: '#FBF3E5', borderRight: '3px solid #C8924A', color: '#4A2A0A' }}
        >
          العدد ستون يُقسَّم بدون كسر على ١، ٢، ٣، ٤، ٥، ٦، ١٠، ١٢، ١٥، ٢٠، ٣٠، ٦٠. هذا ما جعل الحساب اليومي (الكسور الشائعة: الثلث، الربع، الخمس، السدس) سهلاً بلا أعداد عشرية.
        </div>
      </div>

      {/* Still used today */}
      <div>
        <div className="text-[0.62rem] font-bold tracking-[0.12em] mb-2" style={{ color: '#A08050' }}>
          لا يزال معنا — النظام الستيني في حياتنا
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { unit: 'الوقت', desc: '٦٠ ثانية في الدقيقة، ٦٠ دقيقة في الساعة' },
            { unit: 'الزوايا', desc: '٣٦٠° في الدائرة — وكل درجة ٦٠ دقيقة قوسية' },
            { unit: 'الإحداثيات', desc: 'خطوط الطول والعرض: درجات ودقائق وثوانٍ' },
          ].map(item => (
            <div
              key={item.unit}
              className="p-3 rounded-sm"
              style={{ background: '#EEF3FA', borderTop: '2px solid #7AAED4' }}
            >
              <div className="text-[0.72rem] font-bold mb-1" style={{ color: '#26527A' }}>{item.unit}</div>
              <div className="text-[0.72rem]" style={{ color: '#4A6A8A', lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
