interface StringVisProps {
  bridge?: number   // position 1–11 where the bridge sits (default 6 = half)
  label?: string
  note1?: string    // label for left segment
  note2?: string    // label for right segment
}

export default function StringVis({ bridge = 6, label, note1, note2 }: StringVisProps) {
  const total = 12
  const leftW  = (bridge / total) * 100
  const rightW = ((total - bridge) / total) * 100

  return (
    <div className="my-7" dir="ltr">
      {label && (
        <p className="text-[0.63rem] font-bold tracking-[0.13em] uppercase text-greek text-center mb-3">
          {label}
        </p>
      )}

      {/* 12-cell grid */}
      <div
        className="grid border border-rule rounded overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${total}, 1fr)`, minWidth: 300 }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const active = i < bridge
          const isBridge = i === bridge - 1
          return (
            <div
              key={i}
              className="h-9 relative"
              style={{
                background: active ? 'rgba(122,75,28,0.10)' : 'transparent',
                borderRight: isBridge
                  ? '3px solid #1A1008'
                  : i < total - 1 ? '1px solid #D8CEBC' : 'none',
              }}
            >
              {/* wire */}
              <div
                className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                style={{ height: 1.5, background: '#1A1008' }}
              />
            </div>
          )
        })}
      </div>

      {/* segment labels */}
      {(note1 || note2) && (
        <div className="flex mt-1.5 text-[0.63rem] font-bold text-ink-lt" style={{ direction: 'ltr' }}>
          <span style={{ width: `${leftW}%` }} className="text-center text-greek">{note1}</span>
          <span style={{ width: `${rightW}%` }} className="text-center">{note2}</span>
        </div>
      )}

      {/* ratio bar */}
      <div className="flex mt-2 rounded overflow-hidden" style={{ height: 22, direction: 'ltr' }}>
        <div
          className="flex items-center justify-center text-[0.62rem] font-bold text-greek"
          style={{ width: `${leftW}%`, background: 'rgba(122,75,28,0.18)' }}
        >
          {bridge}
        </div>
        <div
          className="flex items-center justify-center text-[0.62rem] font-bold text-ink-lt"
          style={{ width: `${rightW}%`, background: 'rgba(0,0,0,0.05)' }}
        >
          {total - bridge}
        </div>
      </div>
      <p className="text-center text-[0.65rem] text-ink-lt mt-1">
        النسبة {bridge}:{total - bridge} = {bridge / (total - bridge) === Math.round(bridge / (total - bridge)) ? `${bridge / (total - bridge)}:1` : `${bridge}:${total - bridge}`}
      </p>
    </div>
  )
}
