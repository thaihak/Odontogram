import React from 'react'
import { useDental } from '../../context/DentalContext'

const PROBES = [
  { key: 'plaque', label: 'Plaque', color: '#3b82f6' },
  { key: 'bleeding', label: 'Bleeding', color: '#ef4444' },
  { key: 'pus', label: 'Pus', color: '#eab308' },
  { key: 'tartar', label: 'Tartar', color: '#8b5cf6' },
]

export default function ProbingTab({ fdi }) {
  const { state, setProbing } = useDental()
  const probing = fdi ? state.teeth[fdi]?.probing : {}

  return (
    <div>
      <div className="tool-section-title">Periodontal Probing</div>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>
        Toggle indicators per tooth. Dots will appear beneath the tooth number.
      </div>
      {PROBES.map(({ key, label, color }) => (
        <div key={key} className="condition-toggle-card">
          <div className="toggle-header" style={{ display: 'flex', alignItems: 'center', gap: 6, color }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
            {label}
          </div>
          <div className="pill-group">
            <label>
              <input
                type="radio"
                name={`probe-${key}-${fdi}`}
                value="no"
                checked={!probing?.[key]}
                onChange={() => fdi && setProbing(fdi, key, false)}
              />
              <span className="pill-btn">No</span>
            </label>
            <label>
              <input
                type="radio"
                name={`probe-${key}-${fdi}`}
                value="yes"
                checked={!!probing?.[key]}
                onChange={() => fdi && setProbing(fdi, key, true)}
              />
              <span className="pill-btn">Yes</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  )
}
