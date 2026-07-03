interface MathBlockProps {
  children: React.ReactNode
  label?: string
  variant?: 'default' | 'greek' | 'result'
}

export default function MathBlock({ children, label, variant = 'default' }: MathBlockProps) {
  const borderColor = variant === 'greek' ? '#C8924A' : variant === 'result' ? '#7A4B1C' : '#7A6A58'
  const bg = variant === 'result' ? 'rgba(122,75,28,0.06)' : '#EDEBE4'

  return (
    <div
      className="my-5 rounded-sm"
      style={{ background: bg, borderRight: `3px solid ${borderColor}`, padding: '14px 18px' }}
      dir="ltr"
    >
      <div className="font-math text-[1.05rem] text-center text-ink leading-relaxed">
        {children}
      </div>
      {label && (
        <div
          className="text-[0.62rem] text-ink-lt mt-2 tracking-wider"
          style={{ direction: 'rtl', textAlign: 'right' }}
        >
          {label}
        </div>
      )}
    </div>
  )
}
