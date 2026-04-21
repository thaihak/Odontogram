import React, { useEffect, useRef, useCallback } from 'react'
import { useDental } from '../context/DentalContext'
import { getUpperArchFdis, getLowerArchFdis } from '../constants/teethData'

export default function BraceWires({ archRef, archType }) {
  const { state } = useDental()
  const svgRef = useRef(null)

  const archFdis = archType === 'upper' ? getUpperArchFdis() : getLowerArchFdis()

  const redraw = useCallback(() => {
    const svg = svgRef.current
    if (!svg || !archRef.current) return
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const archRect = archRef.current.getBoundingClientRect()
    let prev = null

    archFdis.forEach(fdi => {
      const toothHasBrace = state.teeth[fdi]?.hasBrace
      if (!toothHasBrace) return

      // Find the brace overlay img element inside the arch
      const braceImg = archRef.current.querySelector(`[data-fdi="${fdi}"] .brace-overlay`)
      if (!braceImg || braceImg.style.display === 'none') return

      const rect = braceImg.getBoundingClientRect()
      const cx = rect.left - archRect.left + rect.width / 2
      const cy = rect.top - archRect.top + rect.height / 2
      const radius = rect.width * 0.4

      if (prev) {
        const dx = cx - prev.cx
        const dy = cy - prev.cy
        const len = Math.sqrt(dx * dx + dy * dy)
        if (len > 0) {
          const r1 = prev.radius / len
          const r2 = radius / len
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
          line.setAttribute('x1', prev.cx + dx * r1)
          line.setAttribute('y1', prev.cy + dy * r1)
          line.setAttribute('x2', cx - dx * r2)
          line.setAttribute('y2', cy - dy * r2)
          line.setAttribute('stroke', '#E1E5F4')
          line.setAttribute('stroke-width', '5')
          line.setAttribute('stroke-linecap', 'round')
          svg.appendChild(line)
        }
      }
      prev = { cx, cy, radius }
    })
  }, [archFdis, archRef, state.teeth])

  useEffect(() => {
    let raf
    let start = performance.now()
    const step = (ts) => {
      redraw()
      if (ts - start < 350) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [redraw])

  useEffect(() => {
    window.addEventListener('resize', redraw)
    return () => window.removeEventListener('resize', redraw)
  }, [redraw])

  return (
    <svg
      ref={svgRef}
      className="brace-wires"
      id={`${archType}BraceWires`}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
    />
  )
}
