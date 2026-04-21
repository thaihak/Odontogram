import React from 'react'

export default function SvgPatternDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute', zIndex: -1 }}>
      <defs>
        <pattern id="frac-vert-root" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 50,0 L 35,20 L 65,40 L 35,60 L 65,80 L 50,100" stroke="#e65100" strokeWidth="4" fill="none" strokeDasharray="10,6" strokeLinecap="round" strokeLinejoin="round" />
        </pattern>
        <pattern id="frac-horiz-root" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0,50 L 20,35 L 40,65 L 60,35 L 80,65 L 100,50" stroke="#e65100" strokeWidth="4" fill="none" strokeDasharray="10,6" strokeLinecap="round" strokeLinejoin="round" />
        </pattern>
        <pattern id="frac-vert-crown" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 50,0 L 35,20 L 65,40 L 35,60 L 65,80 L 50,100" stroke="#bf360c" strokeWidth="3" fill="none" strokeDasharray="8,5" strokeLinecap="round" strokeLinejoin="round" />
        </pattern>
        <pattern id="frac-horiz-crown" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0,50 L 20,35 L 40,65 L 60,35 L 80,65 L 100,50" stroke="#bf360c" strokeWidth="3" fill="none" strokeDasharray="8,5" strokeLinecap="round" strokeLinejoin="round" />
        </pattern>
        <pattern id="wear-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(120,80,20,0.55)" strokeWidth="3" />
        </pattern>
      </defs>
    </svg>
  )
}
