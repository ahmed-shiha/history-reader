'use client'
import { useState } from 'react'

const PHILOSOPHERS = [
  {
    name: 'طَالِيس',
    nameEn: 'Thales',
    era: '~585 ق.م',
    city: 'مِيلِيتُوس',
    element: 'الماء',
    icon: '💧',
    color: '#2563eb',
    bg: '#eff6ff',
    border: '#bfdbfe',
    reason: 'الماء يسيل ويجمد ويتبخر — وبه حياة كل نبات ودابة في الأرض.',
  },
  {
    name: 'أَنَاكْسِيمَانْدَر',
    nameEn: 'Anaximander',
    era: '~560 ق.م',
    city: 'مِيلِيتُوس',
    element: 'اللامحدود',
    icon: '∞',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    reason: 'الأصل مادة غير مرئية لا حدّ لها — أرقى من أن تكون ماءً أو غيره.',
  },
  {
    name: 'أَنَاكْسِيمِينِس',
    nameEn: 'Anaximenes',
    era: '~546 ق.م',
    city: 'مِيلِيتُوس',
    element: 'الهواء',
    icon: '💨',
    color: '#0891b2',
    bg: '#ecfeff',
    border: '#a5f3fc',
    reason: 'الهواء يمسك العالم كما تمسك روح الإنسان بدنه.',
  },
  {
    name: 'هِيرَاكْلِيتُوس',
    nameEn: 'Heraclitus',
    era: '~500 ق.م',
    city: 'أَفَسُس',
    element: 'النار',
    icon: '🔥',
    color: '#dc2626',
    bg: '#fff7ed',
    border: '#fed7aa',
    reason: 'الكون في حركة أبدية لا تسكن — والنار أكثر المواد شبهاً بهذا التحول.',
  },
  {
    name: 'إِمْبِيدُوقْلِيس',
    nameEn: 'Empedocles',
    era: '~450 ق.م',
    city: 'صِقِلِّيَة',
    element: 'أربعة عناصر',
    icon: '🌍',
    color: '#059669',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    reason: 'التراب + الماء + الهواء + النار تجمعها "المحبة" وتفرقها "العداوة".',
  },
  {
    name: 'دِيمُوقْرِيطُوس',
    nameEn: 'Democritus',
    era: '~420 ق.م',
    city: 'أَبْدِيرَا',
    element: 'الذرات والخلاء',
    icon: '⚛️',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    reason: 'ذرات صغيرة لا تنقسم تسبح في فراغ لا نهاية له — وكل شيء سواهما وهمٌ وتواضع.',
  },
]

export default function MilesianTheories() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="my-8 rounded-2xl border border-rule bg-surface p-5">
      <p className="text-center text-xs font-semibold text-ink-lt tracking-widest mb-5">
        مِنَ المَاءِ إِلَى الذَّرَّةِ — رِحْلَةُ البَحْثِ عَنِ الأَصْلِ
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
        {PHILOSOPHERS.map((p, i) => (
          <button
            key={i}
            onClick={() => setActive(active === i ? null : i)}
            className="text-right rounded-xl border-2 p-3 transition-all hover:shadow-sm focus:outline-none"
            style={{
              borderColor: active === i ? p.color : p.border,
              backgroundColor: active === i ? p.bg : 'transparent',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-ink-lt font-mono">{p.era}</span>
              <span className="text-xl leading-none">{p.icon}</span>
            </div>
            <p className="text-sm font-bold text-ink leading-tight mb-0.5">{p.name}</p>
            <p className="text-xs text-ink-lt mb-2">{p.nameEn}</p>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${p.color}22`, color: p.color }}
            >
              {p.element}
            </span>
            {active === i && (
              <p
                className="mt-2.5 text-xs text-ink-mid leading-relaxed border-t pt-2"
                style={{ borderColor: p.border }}
              >
                {p.reason}
              </p>
            )}
          </button>
        ))}
      </div>

      {/* Timeline arrow */}
      <div className="flex items-center gap-1 justify-center text-xs text-ink-lt">
        <span>طَالِيس</span>
        <span className="flex-1 border-t border-dashed border-rule mx-2" />
        <span className="text-ink-lt/50">ستة فلاسفة · مئتا عام</span>
        <span className="flex-1 border-t border-dashed border-rule mx-2" />
        <span>دِيمُوقْرِيطُوس</span>
      </div>
      <p className="text-center text-xs text-ink-lt mt-3">
        اضغط على أي فيلسوف لقراءة حجته
      </p>
    </div>
  )
}
