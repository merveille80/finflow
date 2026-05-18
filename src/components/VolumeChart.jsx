import { useState } from 'react'
import './VolumeChart.css'

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

export default function VolumeChart({ transactions }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Compute total income per month
  const monthlyData = months.map((_, i) => {
    const monthTx = transactions.filter(t => {
      const d = new Date(t.created_at)
      return d.getMonth() === i && t.type === 'income'
    })
    return monthTx.reduce((sum, t) => sum + t.amount, 0)
  })

  const maxVal = Math.max(...monthlyData, 1)

  // Total volume for current month
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const totalVolume = transactions
    .filter(t => {
      const d = new Date(t.created_at)
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)

  // Calculate coordinates for responsive SVG (viewBox: 0 0 1200 180)
  const spacing = 1200 / 12
  const points = monthlyData.map((val, i) => {
    const x = i * spacing + spacing / 2
    // Map value to y-axis (150px chart area, leaving 20px padding top/bottom)
    const y = 160 - (val / maxVal) * 135
    const isCurrent = i === currentMonth
    return { x, y, val, month: months[i], isCurrent }
  })

  // Generate SVG path strings
  const linePath = points.map((p, idx) => (idx === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},180 L${points[0].x},180 Z`

  return (
    <div className="card glass-card volume-card-wrapper" style={{ position: 'relative' }}>
      <div className="card-header">
        <div>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Flux de trésorerie
          </span>
          <h3 className="card-title" style={{ fontSize: '18px', fontWeight: '800', marginTop: '2px', color: 'var(--text-primary)' }}>Volume Mensuel</h3>
        </div>
        <div className="card-action" style={{ color: '#ff6b00', fontWeight: '700', cursor: 'pointer' }}>Vue Globale →</div>
      </div>

      <div className="volume-header" style={{ marginBottom: '10px' }}>
        <div className="volume-value" style={{ fontSize: '30px', fontWeight: '850', color: 'var(--text-primary)', letterSpacing: '-0.8px' }}>
          {totalVolume.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} $
        </div>
        <div className="stat-change positive" style={{ color: '#34d399', background: 'rgba(52,211,153,0.06)', padding: '6px 12px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          Mois en cours
        </div>
      </div>

      {/* Floating dynamic tooltip overlay */}
      <div className="chart-tooltip-wrapper" style={{
        height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px'
      }}>
        {hoveredIndex !== null ? (
          <div className="chart-tooltip animate-fade-in" style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)',
            display: 'flex', gap: '8px', boxShadow: 'var(--shadow)'
          }}>
            <span style={{ color: '#ff6b00' }}>{points[hoveredIndex].month} :</span>
            <span>{points[hoveredIndex].val.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} $</span>
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-light)', fontWeight: '600' }}>
            Survolez le graphique pour explorer les flux
          </div>
        )}
      </div>

      {/* Responsive SVG Vector Canvas */}
      <div className="svg-chart-container" style={{ position: 'relative', width: '100%', height: '180px' }}>
        <svg viewBox="0 0 1200 180" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          <defs>
            {/* Stroke Line Gradient matching the orange-white branding, fading to gold in light theme for legibility */}
            <linearGradient id="chart-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5100" />
              <stop offset="100%" stopColor="#ffb700" />
            </linearGradient>
            
            {/* Fill Area Gradient under the stroke */}
            <linearGradient id="chart-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 81, 0, 0.18)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.0)" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="25" x2="1200" y2="25" stroke="var(--border)" opacity="0.3" strokeWidth="1" />
          <line x1="0" y1="92" x2="1200" y2="92" stroke="var(--border)" opacity="0.3" strokeWidth="1" />
          <line x1="0" y1="160" x2="1200" y2="160" stroke="var(--border)" opacity="0.3" strokeWidth="1" />

          {/* Vertical active cursor line */}
          {hoveredIndex !== null && (
            <line 
              x1={points[hoveredIndex].x} 
              y1="0" 
              x2={points[hoveredIndex].x} 
              y2="180" 
              stroke="var(--accent)" 
              opacity="0.25"
              strokeWidth="2" 
              strokeDasharray="4 4" 
            />
          )}

          {/* Filled Area */}
          <path d={areaPath} fill="url(#chart-area-grad)" style={{ transition: 'all 0.3s ease' }} />

          {/* Glowing Stroke Line */}
          <path 
            d={linePath} 
            fill="none" 
            stroke="url(#chart-line-grad)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ filter: 'drop-shadow(0px 4px 10px rgba(255, 81, 0, 0.15))', transition: 'all 0.3s ease' }}
          />

          {/* Interactive nodes (Dots) */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx
            return (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={p.isCurrent ? (isHovered ? 8 : 6) : (isHovered ? 7 : 4.5)}
                fill={p.isCurrent ? 'var(--text-primary)' : (isHovered ? '#ff6b00' : 'var(--bg-primary)')}
                stroke={p.isCurrent ? '#ff6b00' : (isHovered ? 'var(--text-primary)' : 'var(--border)')}
                strokeWidth={isHovered ? 3.5 : 2.5}
                style={{ 
                  transition: 'all 0.15s cubic-bezier(0.25, 1, 0.5, 1)',
                  filter: p.isCurrent ? 'drop-shadow(0 0 6px rgba(255,107,0,0.6))' : 'none'
                }}
              />
            )
          })}

          {/* Invisible Wider Vertical Columns for reactive mouse hover zones */}
          {points.map((p, idx) => (
            <rect
              key={idx}
              x={p.x - spacing / 2}
              y="0"
              width={spacing}
              height="180"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>
      </div>

      {/* Month Labels */}
      <div className="chart-labels" style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', padding: '0 8px' }}>
        {points.map((p, idx) => (
          <span 
            key={idx} 
            className="chart-label" 
            style={{ 
              fontSize: '11px', 
              color: p.isCurrent ? '#ff6b00' : (hoveredIndex === idx ? 'var(--text-primary)' : 'var(--text-light)'),
              fontWeight: p.isCurrent || hoveredIndex === idx ? '800' : '600',
              transition: 'color 0.2s'
            }}
          >
            {p.month}
          </span>
        ))}
      </div>
    </div>
  )
}
