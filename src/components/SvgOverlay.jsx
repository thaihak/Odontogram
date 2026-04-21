import React from 'react'
import { useSvgPaths } from '../hooks/useSvgPaths'
import { getSvgUrl, getSectionLabel } from '../constants/teethData'

export default function SvgOverlay({ viewType, toothType, fdi, pathConditions, topFractureClass, isFocused, onSectionClick }) {
  const url = getSvgUrl(viewType, toothType)
  const { data } = useSvgPaths(url)

  const overlayClass = [
    'section-overlay',
    viewType === 'top' ? 'top-overlay' : viewType === 'normal' ? 'normal-overlay' : 'normal-back-overlay',
    topFractureClass ?? '',
  ].filter(Boolean).join(' ')

  if (!data) return <div className={overlayClass} />

  const { viewBox, paths } = data

  return (
    <div className={overlayClass}>
      <svg viewBox={viewBox} width="100%" height="100%" style={{ display: 'block' }}>
        {paths.map((p, i) => {
          const label = getSectionLabel(toothType, viewType, i, fdi)
          const condClass = pathConditions?.[i] ?? ''
          return (
            <path
              key={i}
              d={p.d}
              className={condClass}
              data-section-label={label}
              onClick={isFocused ? (e) => { e.stopPropagation(); onSectionClick(label, e) } : undefined}
              style={{ cursor: isFocused ? 'pointer' : 'default' }}
            >
              <title>{label}</title>
            </path>
          )
        })}
      </svg>
    </div>
  )
}
