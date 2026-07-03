export default function SqrtGrid() {
  const items = Array.from({ length: 20 }, (_, i) => {
    const n = i + 1
    const sqrt = Math.sqrt(n)
    const isRational = Number.isInteger(sqrt)
    return { n, sqrt, isRational }
  })

  return (
    <div className="my-6" dir="rtl">
      <div
        className="text-[0.62rem] font-bold tracking-[0.12em] mb-3"
        style={{ color: '#A08050' }}
      >
        √١ إلى √٢٠ — أيّها صحيح وأيّها أصم؟
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {items.map(({ n, sqrt, isRational }) => (
          <div
            key={n}
            className="rounded-sm p-3 text-center"
            style={{
              background: isRational ? '#E8F3E0' : '#F5EFE5',
              border: `1px solid ${isRational ? '#8BC474' : '#D8CEBC'}`,
            }}
          >
            <div
              className="text-[0.68rem] font-bold"
              style={{ color: isRational ? '#2A5E0E' : '#7A4B1C' }}
            >
              √{n}
            </div>
            <div
              className="text-[0.72rem] font-math mt-0.5"
              style={{ color: isRational ? '#1A4A08' : '#4A3020', direction: 'ltr' }}
            >
              {isRational ? `= ${sqrt}` : `≈ ${sqrt.toFixed(3)}`}
            </div>
            <div
              className="text-[0.55rem] mt-1 tracking-wide"
              style={{ color: isRational ? '#3A7018' : '#8A6040' }}
            >
              {isRational ? 'صحيح' : 'أصم'}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 text-[0.72rem]" style={{ color: '#7A6A58' }}>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#8BC474' }}></span>
          عدد صحيح (جذر كامل)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: '#D8CEBC' }}></span>
          عدد أصم (لا ينتهي ولا يتكرر)
        </span>
      </div>
    </div>
  )
}
