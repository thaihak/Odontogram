export const FDI_LIST = [
  18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28,
  48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38,
]

export const QUADRANTS = [
  { key: 'UL', label: 'UL', fdis: [18, 17, 16, 15, 14, 13, 12, 11], isUpper: true },
  { key: 'UR', label: 'UR', fdis: [21, 22, 23, 24, 25, 26, 27, 28], isUpper: true },
  { key: 'LR', label: 'LR', fdis: [48, 47, 46, 45, 44, 43, 42, 41], isUpper: false },
  { key: 'LL', label: 'LL', fdis: [31, 32, 33, 34, 35, 36, 37, 38], isUpper: false },
]

// Sequential positions (1-32) for tooth type classification, matching original main.js
const FDI_TO_POS = {
  18: 17, 17: 18, 16: 19, 15: 20, 14: 21, 13: 22, 12: 23, 11: 24,
  21: 25, 22: 26, 23: 27, 24: 28, 25: 29, 26: 30, 27: 31, 28: 32,
  48: 1, 47: 2, 46: 3, 45: 4, 44: 5, 43: 6, 42: 7, 41: 8,
  31: 9, 32: 10, 33: 11, 34: 12, 35: 13, 36: 14, 37: 15, 38: 16,
}

const MOLAR_POS = new Set([1, 2, 3, 14, 15, 16, 17, 18, 19, 30, 31, 32])
const PREMOLAR_POS = new Set([4, 5, 12, 13, 20, 21, 28, 29])
const TIGHT_POS = new Set([4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29])

export function getToothType(fdi) {
  const pos = FDI_TO_POS[fdi]
  if (MOLAR_POS.has(pos)) return 'molar'
  if (PREMOLAR_POS.has(pos)) return 'premolar'
  return 'normal'
}

export function isToothTight(fdi) {
  return TIGHT_POS.has(FDI_TO_POS[fdi])
}

export function isUpperTooth(fdi) {
  const q = Math.floor(fdi / 10)
  return q === 1 || q === 2
}

export function getToothQuadrant(fdi) {
  return Math.floor(fdi / 10)
}

export function getUpperArchFdis() {
  return [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
}

export function getLowerArchFdis() {
  return [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
}

// Anatomy labels per tooth type and view — index 0 is always the full-tooth background path
export const ANATOMY_LABELS = {
  molar: {
    top: ['Tooth', 'Occlusal', 'Mesial', 'Distal', 'Mesio Palatal Cusp', 'Disto Palatal Cusp', 'Mesio Buccal Cusp', 'Disto Buccal Cusp'],
    normal: ['Tooth', 'Root', 'Disto Buccal Cusp', 'Mesio Buccal Cusp', 'Mesial', 'Distal', 'Cervical Buccal', 'Buccal'],
    normalBack: ['Tooth', 'Root', 'Disto Palatal Cusp', 'Mesio Palatal Cusp', 'Mesial', 'Distal', 'Cervical Palatal', 'Palatal'],
  },
  premolar: {
    top: ['Tooth', 'Mesial', 'Buccal Cusp', 'Buccal Surface', 'Palatal Cusp', 'Palatal Surface', 'Distal', 'Occlusal'],
    normal: ['Tooth', 'Root', 'Buccal', 'Buccal Surface', 'Mesial', 'Distal', 'Cervical Buccal'],
    normalBack: ['Tooth', 'Root', 'Buccal', 'Buccal Surface', 'Mesial', 'Distal', 'Cervical Buccal'],
  },
  normal: {
    top: ['Tooth', 'Distal', 'Palatal Surface', 'Mesial', 'Buccal Surface', 'Incisal'],
    normal: ['Tooth', 'Root', 'Buccal Surface', 'Incisal', 'Cervical Buccal', 'Buccal', 'Mesial', 'Distal'],
    normalBack: ['Tooth', 'Root', 'Palatal Surface', 'Incisal', 'Cervical Palatal', 'Palatal', 'Mesial', 'Distal'],
  },
}

export function getSectionLabel(toothType, viewType, index, fdi) {
  const base = ANATOMY_LABELS[toothType]?.[viewType]?.[index] ?? `Section ${index + 1}`
  return base === 'Tooth' ? `Tooth ${fdi}` : base
}

// Path filter helpers — operate on label strings
export function isCrownLabel(label) {
  const l = label.toLowerCase()
  return !l.includes('root') && !l.startsWith('tooth ')
}

export function isRootLabel(label) {
  return label.toLowerCase().includes('root')
}

export function isBuccalLabel(label) {
  const l = label.toLowerCase()
  return (l.includes('buccal') || l.includes('facial')) && !l.startsWith('tooth ')
}

export function isPalatalLabel(label) {
  const l = label.toLowerCase()
  return (l.includes('palatal') || l.includes('lingual')) && !l.startsWith('tooth ')
}

export const ALL_CONDITIONS = [
  'healthy', 'missing', 'to-be-extracted', 'pontic-root', 'veneer', 'implant',
  'brace', 'pfm', 'pfm-zirconia', 'pfm-metal', 'endo', 'eruption', 'treated',
  'decay', 'wear', 'fracture-crown-vertical', 'fracture-crown-horizontal',
  'fracture-root-vertical', 'fracture-root-horizontal',
  'discoloration-gray', 'discoloration-red', 'discoloration-yellow',
  'apical', 'devdisorder',
]

export function getSvgUrl(viewType, toothType) {
  if (viewType === 'top') return `/top-img/top-${toothType}-section.svg`
  if (viewType === 'normal') return `/normal-img/${toothType}-section.svg`
  // normalBack falls back to normal-img if no back-specific SVG
  return `/normal-img/${toothType}-section.svg`
}

export function getToothImageSrc(fdi, viewType, useImplant = false) {
  if (viewType === 'top') return `/top-img/${fdi}.png`
  if (viewType === 'normal') {
    return useImplant ? `/normal-implant-root/${fdi}.png` : `/normal-img/${fdi}.png`
  }
  if (viewType === 'normalBack') {
    return useImplant ? `/normal-back-view-implant-root/${fdi}.png` : `/normal-back-view-img/${fdi}.png`
  }
  return `/normal-img/${fdi}.png`
}
