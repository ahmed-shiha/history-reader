interface AestheticNoteProps {
  children: React.ReactNode
  type?: 'beauty' | 'logic' | 'wound'
  title?: string
}

const CONFIG = {
  beauty: { color: '#7A4B1C', bg: '#FBF3E5', border: '#C8924A', icon: '✦', label: 'جمالية' },
  logic:  { color: '#26527A', bg: '#EEF3FA', border: '#7AAED4', icon: '◈', label: 'منطق' },
  wound:  { color: '#7A1C1C', bg: '#FDF0F0', border: '#C84A4A', icon: '⚠', label: 'كسر النظام' },
}

export default function AestheticNote({ children, type = 'beauty', title }: AestheticNoteProps) {
  const c = CONFIG[type]
  return (
    <div
      className="my-6 rounded-sm"
      dir="rtl"
      style={{ background: c.bg, borderRight: `3px solid ${c.border}`, padding: '18px 20px 20px' }}
    >
      <div
        className="flex items-center gap-2 mb-3 text-[0.62rem] font-bold tracking-[0.14em] uppercase"
        style={{ color: c.color }}
      >
        <span>{c.icon}</span>
        <span>{title ?? c.label}</span>
      </div>
      <div className="text-[0.96rem] leading-[1.95] text-ink-mid">
        {children}
      </div>
    </div>
  )
}
