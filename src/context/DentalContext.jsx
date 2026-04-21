import React, { createContext, useContext, useReducer, useCallback } from 'react'
import {
  FDI_LIST, getToothType, isUpperTooth, getUpperArchFdis, getLowerArchFdis,
  ANATOMY_LABELS, getSectionLabel, isCrownLabel, isRootLabel, isBuccalLabel,
  isPalatalLabel, ALL_CONDITIONS,
} from '../constants/teethData'

// ─── Initial state ────────────────────────────────────────────────────────────
function buildInitialTeeth() {
  const teeth = {}
  FDI_LIST.forEach(fdi => {
    teeth[fdi] = {
      pathConditions: { top: {}, normal: {}, normalBack: {} },
      topOverlayFractureClass: null,
      hasBrace: '',
      useImplantImage: false,
      probing: { plaque: false, bleeding: false, pus: false, tartar: false },
      notes: { apical: '', devDisorder: '' },
      endoTests: null,
      history: [],
    }
  })
  return teeth
}

const initialState = {
  teeth: buildInitialTeeth(),
  ui: {
    focusedToothFDI: null,
    sidebarOpen: false,
    sidebarPosition: 'right',
    editorOpen: false,
    summaryOpen: false,
    viewMode: 'all',
    activeTab: 'pathology',
    activeTool: 'decay',
  },
  toolOptions: {
    decay: { extent: 'Single', showDetails: false, stage: 'Enamel', cavitation: 'No', pulp: 'Not Involved', level: 'C1' },
    fracture: { location: 'Crown', direction: 'Vertical' },
    wear: { surface: 'Buccal', type: 'Abrasion' },
    discoloration: { color: 'gray' },
    implant: { material: 'Titanium' },
    brace: { type: 'standard' },
    restoration: { type: 'Filling', material: 'Composite', quality: 'Sufficient', detail: 'None' },
    endo: { cold: 'Not applicable', percussion: 'Not painful', palpation: 'Not painful', heat: 'Not applicable', electricity: '' },
  },
  globalHistory: {},
  actionLog: [],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function resolveToolClass(tool, toolOptions) {
  if (tool === 'fracture') {
    const loc = toolOptions.fracture.location.toLowerCase()
    const dir = toolOptions.fracture.direction.toLowerCase()
    return `fracture-${loc}-${dir}`
  }
  if (tool === 'discoloration') {
    return `discoloration-${toolOptions.discoloration.color.toLowerCase()}`
  }
  return tool
}

function getLabels(toothType, viewType, fdi) {
  return (ANATOMY_LABELS[toothType]?.[viewType] ?? []).map((label, i) =>
    label === 'Tooth' ? `Tooth ${fdi}` : label
  )
}

function updatePaths(conditions, indices, classToAdd, clear = false) {
  const updated = { ...conditions }
  indices.forEach(i => {
    if (clear || classToAdd === null) {
      delete updated[i]
    } else {
      updated[i] = classToAdd
    }
  })
  return updated
}

function anyPathHasClass(conditions, indices, cls) {
  return indices.some(i => conditions[i] === cls)
}

function buildLogEntry(toothFDI, sectionName, toolKey, extraNote, toolOptions, now) {
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  let badgeClass = toolKey
  if (toolKey.includes('fracture')) badgeClass = 'fracture'
  if (toolKey.includes('discoloration')) badgeClass = 'discoloration'

  let details = {}
  let label = toolKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  if (toolKey === 'decay') {
    details = {
      extent: toolOptions.decay.extent,
      ...(toolOptions.decay.showDetails ? {
        stage: toolOptions.decay.stage,
        cavitation: toolOptions.decay.cavitation,
        pulp: toolOptions.decay.pulp,
        level: toolOptions.decay.level,
      } : {}),
    }
  } else if (toolKey === 'implant') {
    details = { material: toolOptions.implant.material }
  } else if (toolKey === 'brace') {
    details = { status: extraNote }
  } else if (toolKey === 'wear') {
    details = { type: toolOptions.wear.type }
  } else if (toolKey.startsWith('discoloration')) {
    details = { color: toolKey.split('-')[1] }
  } else if (toolKey === 'treated') {
    details = {
      type: toolOptions.restoration.type,
      material: toolOptions.restoration.material,
      quality: toolOptions.restoration.quality,
      detail: toolOptions.restoration.detail,
    }
    if (toolOptions.restoration.material.includes('PFM')) {
      badgeClass = toolOptions.restoration.material === 'PFM - Zirconia' ? 'pfm-zirconia'
        : toolOptions.restoration.material === 'PFM - Metal' ? 'pfm-metal' : 'pfm'
    }
  } else if (extraNote) {
    details = { status: extraNote }
  }

  return {
    id: Date.now() + Math.random(),
    time: timeString,
    isoDate: now.toISOString(),
    toothFDI,
    sectionName,
    toolKey,
    badgeClass,
    label,
    extraNote,
    details,
  }
}

// ─── Condition application ────────────────────────────────────────────────────
function applyCondition(state, payload) {
  const { fdi, sectionLabel, isDoubleClick } = payload
  const { activeTool } = state.ui
  const { toolOptions } = state
  const appliedClass = resolveToolClass(activeTool, toolOptions)

  const toothType = getToothType(fdi)
  const tooth = state.teeth[fdi]
  const now = new Date()

  const topLabels = getLabels(toothType, 'top', fdi)
  const normalLabels = getLabels(toothType, 'normal', fdi)
  const backLabels = getLabels(toothType, 'normalBack', fdi)

  let newTooth = { ...tooth, pathConditions: { ...tooth.pathConditions } }
  let logSection = sectionLabel ?? 'Entire Crown'
  let logExtra = ''

  // ─── Helper: get indices by predicate for a view
  function indicesWhere(labels, pred) {
    return labels.map((l, i) => ({ i, l })).filter(({ l }) => pred(l)).map(({ i }) => i)
  }

  // ─── 1. Wear ───────────────────────────────────────────────────────────────
  if (activeTool === 'wear') {
    const surface = toolOptions.wear.surface
    const isBuccal = surface === 'Buccal'
    const pred = isBuccal ? isBuccalLabel : isPalatalLabel
    const normalIdx = indicesWhere(normalLabels, isBuccal ? isBuccalLabel : isPalatalLabel)
    const backIdx = indicesWhere(backLabels, isBuccal ? isBuccalLabel : isPalatalLabel)
    const topIdx = indicesWhere(topLabels, pred)

    const allIdx = [
      ...normalIdx.map(i => ({ view: 'normal', i })),
      ...backIdx.map(i => ({ view: 'normalBack', i })),
      ...topIdx.map(i => ({ view: 'top', i })),
    ]
    const isAnyApplied = allIdx.some(({ view, i }) => newTooth.pathConditions[view][i] === 'wear')
    allIdx.forEach(({ view, i }) => {
      const conds = { ...newTooth.pathConditions[view] }
      ALL_CONDITIONS.forEach(c => delete conds[i] === c && (delete conds[i]))
      delete conds[i]
      if (!isAnyApplied) conds[i] = 'wear'
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    logSection = `${surface} Crown & Top`
    logExtra = isAnyApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, 'wear', logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 2. Decay (whole crown shortcut) ──────────────────────────────────────
  if (activeTool === 'decay' && toolOptions.decay.extent === 'Crown' && !isDoubleClick) {
    const allViews = ['top', 'normal', 'normalBack']
    const labelMap = { top: topLabels, normal: normalLabels, normalBack: backLabels }
    let isAnyApplied = false
    allViews.forEach(view => {
      const idx = indicesWhere(labelMap[view], isCrownLabel)
      if (idx.some(i => newTooth.pathConditions[view][i] === 'decay')) isAnyApplied = true
    })
    allViews.forEach(view => {
      const idx = indicesWhere(labelMap[view], isCrownLabel)
      const conds = { ...newTooth.pathConditions[view] }
      idx.forEach(i => { delete conds[i]; if (!isAnyApplied) conds[i] = 'decay' })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    logSection = 'Whole Crown'
    logExtra = isAnyApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, 'decay', logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 3. Discoloration ─────────────────────────────────────────────────────
  if (activeTool === 'discoloration') {
    const allViews = ['top', 'normal', 'normalBack']
    const labelMap = { top: topLabels, normal: normalLabels, normalBack: backLabels }
    let isAnyApplied = false
    allViews.forEach(view => {
      const idx = labelMap[view].map((l, i) => ({ l, i })).filter(({ l }) => !l.toLowerCase().startsWith('tooth ')).map(({ i }) => i)
      if (idx.some(i => newTooth.pathConditions[view][i] === appliedClass)) isAnyApplied = true
    })
    allViews.forEach(view => {
      const idx = labelMap[view].map((l, i) => ({ l, i })).filter(({ l }) => !l.toLowerCase().startsWith('tooth ')).map(({ i }) => i)
      const conds = { ...newTooth.pathConditions[view] }
      idx.forEach(i => { delete conds[i]; if (!isAnyApplied) conds[i] = appliedClass })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    logSection = 'Whole Tooth'
    logExtra = isAnyApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, appliedClass, logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 4. Missing (double=whole, single=section) ────────────────────────────
  if (activeTool === 'missing' && isDoubleClick) {
    const allViews = ['top', 'normal', 'normalBack']
    const labelMap = { top: topLabels, normal: normalLabels, normalBack: backLabels }
    let isAnyApplied = false
    allViews.forEach(view => {
      const idx = labelMap[view].map((l, i) => ({ l, i })).filter(({ l }) => !l.toLowerCase().startsWith('tooth ')).map(({ i }) => i)
      if (idx.some(i => newTooth.pathConditions[view][i] === 'missing')) isAnyApplied = true
    })
    allViews.forEach(view => {
      const idx = labelMap[view].map((l, i) => ({ l, i })).filter(({ l }) => !l.toLowerCase().startsWith('tooth ')).map(({ i }) => i)
      const conds = { ...newTooth.pathConditions[view] }
      idx.forEach(i => { delete conds[i]; if (!isAnyApplied) conds[i] = 'missing' })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    logSection = 'Whole Tooth'
    logExtra = isAnyApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, 'missing', logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 5. To-be-extracted ───────────────────────────────────────────────────
  if (activeTool === 'to-be-extracted') {
    const allViews = ['top', 'normal', 'normalBack']
    const labelMap = { top: topLabels, normal: normalLabels, normalBack: backLabels }
    let isAnyApplied = false
    allViews.forEach(view => {
      const idx = labelMap[view].map((l, i) => ({ l, i })).filter(({ l }) => !l.toLowerCase().startsWith('tooth ')).map(({ i }) => i)
      if (idx.some(i => newTooth.pathConditions[view][i] === 'to-be-extracted')) isAnyApplied = true
    })
    allViews.forEach(view => {
      const idx = labelMap[view].map((l, i) => ({ l, i })).filter(({ l }) => !l.toLowerCase().startsWith('tooth ')).map(({ i }) => i)
      const conds = { ...newTooth.pathConditions[view] }
      idx.forEach(i => { delete conds[i]; if (!isAnyApplied) conds[i] = 'to-be-extracted' })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    logSection = 'Whole Tooth'
    logExtra = isAnyApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, 'to-be-extracted', logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 6. Pontic ────────────────────────────────────────────────────────────
  if (activeTool === 'pontic') {
    const rootViews = [
      { view: 'normal', idx: indicesWhere(normalLabels, isRootLabel) },
      { view: 'normalBack', idx: indicesWhere(backLabels, isRootLabel) },
    ]
    const isAnyApplied = rootViews.some(({ view, idx }) => idx.some(i => newTooth.pathConditions[view][i] === 'pontic-root'))
    rootViews.forEach(({ view, idx }) => {
      const conds = { ...newTooth.pathConditions[view] }
      idx.forEach(i => { delete conds[i]; if (!isAnyApplied) conds[i] = 'pontic-root' })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    logSection = 'Root Blacked Out'
    logExtra = isAnyApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, 'pontic', logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 7. Veneer ────────────────────────────────────────────────────────────
  if (activeTool === 'veneer') {
    const targets = [
      { view: 'normal', idx: indicesWhere(normalLabels, isCrownLabel) },
      { view: 'top', idx: indicesWhere(topLabels, isBuccalLabel) },
    ]
    const isAnyApplied = targets.some(({ view, idx }) => idx.some(i => newTooth.pathConditions[view][i] === 'veneer'))
    targets.forEach(({ view, idx }) => {
      const conds = { ...newTooth.pathConditions[view] }
      idx.forEach(i => { delete conds[i]; if (!isAnyApplied) conds[i] = 'veneer' })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    logSection = 'Buccal Crown & Top'
    logExtra = isAnyApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, 'veneer', logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 8. Crown fracture ────────────────────────────────────────────────────
  if (appliedClass.startsWith('fracture-crown')) {
    const isApplied = newTooth.topOverlayFractureClass === appliedClass
    newTooth = {
      ...newTooth,
      topOverlayFractureClass: isApplied ? null : appliedClass,
    }
    const dir = appliedClass.includes('vertical') ? 'Vertical' : 'Horizontal'
    logSection = `Crown ${dir}`
    logExtra = isApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, appliedClass, logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 9. Root fracture ─────────────────────────────────────────────────────
  if (appliedClass.startsWith('fracture-root')) {
    const rootViews = [
      { view: 'normal', idx: indicesWhere(normalLabels, isRootLabel) },
      { view: 'normalBack', idx: indicesWhere(backLabels, isRootLabel) },
    ]
    const isAnyApplied = rootViews.some(({ view, idx }) => idx.some(i => newTooth.pathConditions[view][i] === appliedClass))
    rootViews.forEach(({ view, idx }) => {
      const conds = { ...newTooth.pathConditions[view] }
      idx.forEach(i => { delete conds[i]; if (!isAnyApplied) conds[i] = appliedClass })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    const dir = appliedClass.includes('vertical') ? 'Vertical' : 'Horizontal'
    logSection = `Root ${dir}`
    logExtra = isAnyApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, appliedClass, logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 10. Implant ──────────────────────────────────────────────────────────
  if (activeTool === 'implant') {
    const rootViews = [
      { view: 'normal', idx: indicesWhere(normalLabels, isRootLabel) },
      { view: 'normalBack', idx: indicesWhere(backLabels, isRootLabel) },
    ]
    const isAnyApplied = rootViews.some(({ view, idx }) => idx.some(i => newTooth.pathConditions[view][i] === 'implant'))
    rootViews.forEach(({ view, idx }) => {
      const conds = { ...newTooth.pathConditions[view] }
      idx.forEach(i => { delete conds[i]; if (!isAnyApplied) conds[i] = 'implant' })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    newTooth = { ...newTooth, useImplantImage: !isAnyApplied }
    logSection = 'Root (Implant Applied)'
    logExtra = isAnyApplied ? 'Removed' : ''
    const log = buildLogEntry(fdi, logSection, 'implant', logExtra, toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 11. Brace (handled separately via APPLY_BRACE action) ───────────────
  if (activeTool === 'brace') return state

  // ─── 12. Apical / Endo / Eruption (driven by save buttons) ───────────────
  if (['apical', 'endo', 'eruption'].includes(activeTool)) return state

  // ─── 13. Healthy (clear) ──────────────────────────────────────────────────
  if (appliedClass === 'healthy') {
    if (isDoubleClick) {
      // Clear all paths
      newTooth = {
        ...newTooth,
        pathConditions: { top: {}, normal: {}, normalBack: {} },
        topOverlayFractureClass: null,
      }
      logSection = 'Entire Crown'
    } else if (sectionLabel) {
      const allViews = ['top', 'normal', 'normalBack']
      allViews.forEach(view => {
        const conds = { ...newTooth.pathConditions[view] }
        Object.keys(conds).forEach(i => {
          const label = getSectionLabel(toothType, view, parseInt(i), fdi)
          if (label === sectionLabel) delete conds[i]
        })
        newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
      })
    }
    const log = buildLogEntry(fdi, logSection, 'healthy', '', toolOptions, now)
    return finalize(state, newTooth, fdi, log, now)
  }

  // ─── 14. Standard section application ─────────────────────────────────────
  let finalClass = appliedClass
  if (appliedClass === 'treated') {
    const mat = toolOptions.restoration.material
    if (mat === 'PFM') finalClass = 'pfm'
    else if (mat === 'PFM - Zirconia') finalClass = 'pfm-zirconia'
    else if (mat === 'PFM - Metal') finalClass = 'pfm-metal'
  }

  if (isDoubleClick) {
    const allViews = ['top', 'normal', 'normalBack']
    const labelMap = { top: topLabels, normal: normalLabels, normalBack: backLabels }
    let isAnyApplied = false
    allViews.forEach(view => {
      const idx = indicesWhere(labelMap[view], isCrownLabel)
      if (idx.some(i => newTooth.pathConditions[view][i] === finalClass)) isAnyApplied = true
    })
    allViews.forEach(view => {
      const idx = indicesWhere(labelMap[view], isCrownLabel)
      const conds = { ...newTooth.pathConditions[view] }
      idx.forEach(i => { delete conds[i]; if (!isAnyApplied) conds[i] = finalClass })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    logSection = 'Entire Crown'
    logExtra = isAnyApplied ? 'Removed' : ''
  } else if (sectionLabel) {
    const allViews = ['top', 'normal', 'normalBack']
    const labelMap = { top: topLabels, normal: normalLabels, normalBack: backLabels }
    let isApplied = false
    allViews.forEach(view => {
      labelMap[view].forEach((label, i) => {
        if (label === sectionLabel && newTooth.pathConditions[view][i] === finalClass) isApplied = true
      })
    })
    allViews.forEach(view => {
      const conds = { ...newTooth.pathConditions[view] }
      labelMap[view].forEach((label, i) => {
        if (label === sectionLabel) {
          delete conds[i]
          if (!isApplied) conds[i] = finalClass
        }
      })
      newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
    })
    logExtra = isApplied ? 'Removed' : ''
  }

  const log = buildLogEntry(fdi, logSection, finalClass, logExtra, toolOptions, now)
  return finalize(state, newTooth, fdi, log, now)
}

function applyBrace(state, payload) {
  const { fdi, isDoubleClick } = payload
  const braceType = state.toolOptions.brace.type
  const now = new Date()
  const isUpper = isUpperTooth(fdi)
  const archFdis = isUpper ? getUpperArchFdis() : getLowerArchFdis()
  let newTeeth = { ...state.teeth }
  const logs = []

  const makeBraceLog = (f, extra) => buildLogEntry(f, 'Front Crown', 'brace', extra, state.toolOptions, now)

  if (isDoubleClick) {
    archFdis.forEach(f => {
      if (newTeeth[f]?.hasBrace) {
        newTeeth[f] = { ...newTeeth[f], hasBrace: '' }
        logs.push(makeBraceLog(f, 'Removed'))
      }
    })
  } else {
    const currentBraceType = newTeeth[fdi].hasBrace
    if (currentBraceType === braceType) {
      newTeeth[fdi] = { ...newTeeth[fdi], hasBrace: '' }
      logs.push(makeBraceLog(fdi, 'Removed'))
    } else if (currentBraceType && currentBraceType !== braceType) {
      const logTypeStr = braceType === 'rubber' ? 'Rubber Bands' : 'Standard'
      archFdis.forEach(f => {
        if (newTeeth[f]?.hasBrace) {
          newTeeth[f] = { ...newTeeth[f], hasBrace: braceType }
          logs.push(makeBraceLog(f, `Changed to: ${logTypeStr}`))
        }
      })
    } else {
      const currentBracesInArch = archFdis.filter(f => newTeeth[f]?.hasBrace)
      let targetFdis = [fdi]
      if (currentBracesInArch.length === 0) {
        const quad = Math.floor(fdi / 10)
        const pos = fdi % 10
        const mirroredQuad = quad === 1 ? 2 : quad === 2 ? 1 : quad === 3 ? 4 : 3
        const mirroredFdi = mirroredQuad * 10 + pos
        const idx1 = archFdis.indexOf(fdi)
        const idx2 = archFdis.indexOf(mirroredFdi)
        if (idx1 !== -1 && idx2 !== -1) {
          const minIdx = Math.min(idx1, idx2)
          const maxIdx = Math.max(idx1, idx2)
          targetFdis = archFdis.slice(minIdx, maxIdx + 1)
        }
      }
      const logTypeStr = braceType === 'rubber' ? 'Rubber Bands' : 'Standard'
      targetFdis.forEach(f => {
        if (newTeeth[f]) {
          newTeeth[f] = { ...newTeeth[f], hasBrace: braceType }
          logs.push(makeBraceLog(f, `Applied: ${logTypeStr}`))
        }
      })
    }
  }

  let newGlobalHistory = { ...state.globalHistory }
  logs.forEach(log => {
    newGlobalHistory = addToHistory(newGlobalHistory, log)
    if (newTeeth[log.toothFDI]) {
      newTeeth[log.toothFDI] = {
        ...newTeeth[log.toothFDI],
        history: [...newTeeth[log.toothFDI].history, toBackendRecord(log)],
      }
    }
  })

  const newActionLog = [...logs, ...state.actionLog].slice(0, 50)

  return { ...state, teeth: newTeeth, globalHistory: newGlobalHistory, actionLog: newActionLog }
}

function addToHistory(globalHistory, log) {
  if (!log.toothFDI || isNaN(log.toothFDI)) return globalHistory
  const prev = globalHistory[log.toothFDI] ?? []
  return { ...globalHistory, [log.toothFDI]: [log, ...prev] }
}

function toBackendRecord(log) {
  return { date: log.isoDate, section: log.sectionName, condition: log.toolKey, details: log.details }
}

function finalize(state, newTooth, fdi, log, now) {
  const newTeeth = {
    ...state.teeth,
    [fdi]: {
      ...newTooth,
      history: [...newTooth.history, toBackendRecord(log)],
    },
  }
  const newGlobalHistory = addToHistory(state.globalHistory, log)
  const newActionLog = [log, ...state.actionLog].slice(0, 50)
  return { ...state, teeth: newTeeth, globalHistory: newGlobalHistory, actionLog: newActionLog }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'FOCUS_TOOTH': {
      const { fdi } = action.payload
      const quad = Math.floor(fdi / 10)
      const pos = quad === 1 || quad === 4 ? 'right' : 'left'
      return {
        ...state,
        ui: { ...state.ui, focusedToothFDI: fdi, sidebarOpen: true, sidebarPosition: pos },
      }
    }
    case 'CLOSE_SIDEBAR':
      return { ...state, ui: { ...state.ui, focusedToothFDI: null, sidebarOpen: false, editorOpen: false } }
    case 'SET_ACTIVE_TOOL':
      return { ...state, ui: { ...state.ui, activeTool: action.payload } }
    case 'SET_ACTIVE_TAB':
      return { ...state, ui: { ...state.ui, activeTab: action.payload } }
    case 'SET_VIEW_MODE':
      return { ...state, ui: { ...state.ui, viewMode: action.payload } }
    case 'OPEN_EDITOR':
      return { ...state, ui: { ...state.ui, editorOpen: true, sidebarPosition: 'right' } }
    case 'CLOSE_EDITOR':
      return { ...state, ui: { ...state.ui, editorOpen: false } }
    case 'OPEN_SUMMARY':
      return { ...state, ui: { ...state.ui, summaryOpen: true } }
    case 'CLOSE_SUMMARY':
      return { ...state, ui: { ...state.ui, summaryOpen: false } }
    case 'SET_TOOL_OPTION': {
      const { tool, key, value } = action.payload
      return {
        ...state,
        toolOptions: {
          ...state.toolOptions,
          [tool]: { ...state.toolOptions[tool], [key]: value },
        },
      }
    }
    case 'APPLY_CONDITION':
      return applyCondition(state, action.payload)
    case 'APPLY_BRACE':
      return applyBrace(state, action.payload)
    case 'SET_PROBING': {
      const { fdi, probe, value } = action.payload
      const now = new Date()
      const tooth = state.teeth[fdi]
      const newTooth = { ...tooth, probing: { ...tooth.probing, [probe]: value } }
      const probe2 = probe.charAt(0).toUpperCase() + probe.slice(1)
      const log = buildLogEntry(fdi, 'Probing', 'probing', `${probe2}: ${value ? 'Yes' : 'No'}`, state.toolOptions, now)
      return finalize(state, newTooth, fdi, log, now)
    }
    case 'SAVE_NOTE': {
      const { fdi, noteType, text } = action.payload
      const now = new Date()
      const tooth = state.teeth[fdi]
      const toothType = getToothType(fdi)
      const normalLabels = getLabels(toothType, 'normal', fdi)
      const backLabels = getLabels(toothType, 'normalBack', fdi)
      let newTooth = { ...tooth, notes: { ...tooth.notes, [noteType]: text } }
      const condClass = noteType === 'apical' ? 'apical' : 'eruption'
      const rootViews = [
        { view: 'normal', labels: normalLabels },
        { view: 'normalBack', labels: backLabels },
      ]
      if (noteType === 'apical') {
        rootViews.forEach(({ view, labels }) => {
          const conds = { ...newTooth.pathConditions[view] }
          labels.forEach((l, i) => { if (isRootLabel(l)) { delete conds[i]; conds[i] = condClass } })
          newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
        })
      } else {
        const allViews = ['top', 'normal', 'normalBack']
        const labelMap = { top: getLabels(toothType, 'top', fdi), normal: normalLabels, normalBack: backLabels }
        allViews.forEach(view => {
          const conds = { ...newTooth.pathConditions[view] }
          labelMap[view].forEach((l, i) => {
            if (!l.toLowerCase().startsWith('tooth ')) { delete conds[i]; conds[i] = condClass }
          })
          newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
        })
      }
      const log = buildLogEntry(fdi, noteType === 'apical' ? 'Apical Condition' : 'Tooth Eruption', 'note', text, state.toolOptions, now)
      return finalize(state, newTooth, fdi, log, now)
    }
    case 'SAVE_ENDO': {
      const { fdi, tests } = action.payload
      const now = new Date()
      const tooth = state.teeth[fdi]
      const toothType = getToothType(fdi)
      const normalLabels = getLabels(toothType, 'normal', fdi)
      const backLabels = getLabels(toothType, 'normalBack', fdi)
      let newTooth = { ...tooth, endoTests: tests }
      const rootViews = [
        { view: 'normal', labels: normalLabels },
        { view: 'normalBack', labels: backLabels },
      ]
      rootViews.forEach(({ view, labels }) => {
        const conds = { ...newTooth.pathConditions[view] }
        labels.forEach((l, i) => { if (isRootLabel(l)) { delete conds[i]; conds[i] = 'endo' } })
        newTooth.pathConditions = { ...newTooth.pathConditions, [view]: conds }
      })
      const details = `Cold: ${tests.cold} | Perc: ${tests.percussion} | Palp: ${tests.palpation} | Heat: ${tests.heat} | Elec: ${tests.electricity || 'None'}`
      const log = buildLogEntry(fdi, 'Endo Tests', 'endo', details, state.toolOptions, now)
      return finalize(state, newTooth, fdi, log, now)
    }
    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const DentalContext = createContext(null)

export function DentalProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const focusTooth = useCallback((fdi) => dispatch({ type: 'FOCUS_TOOTH', payload: { fdi } }), [])
  const closeSidebar = useCallback(() => dispatch({ type: 'CLOSE_SIDEBAR' }), [])
  const setActiveTool = useCallback((tool) => dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool }), [])
  const setActiveTab = useCallback((tab) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }), [])
  const setViewMode = useCallback((mode) => dispatch({ type: 'SET_VIEW_MODE', payload: mode }), [])
  const openEditor = useCallback(() => dispatch({ type: 'OPEN_EDITOR' }), [])
  const closeEditor = useCallback(() => dispatch({ type: 'CLOSE_EDITOR' }), [])
  const openSummary = useCallback(() => dispatch({ type: 'OPEN_SUMMARY' }), [])
  const closeSummary = useCallback(() => dispatch({ type: 'CLOSE_SUMMARY' }), [])

  const setToolOption = useCallback((tool, key, value) =>
    dispatch({ type: 'SET_TOOL_OPTION', payload: { tool, key, value } }), [])

  const applyConditionAction = useCallback((fdi, sectionLabel, isDoubleClick) =>
    dispatch({ type: 'APPLY_CONDITION', payload: { fdi, sectionLabel, isDoubleClick } }), [])

  const applyBraceAction = useCallback((fdi, isDoubleClick) =>
    dispatch({ type: 'APPLY_BRACE', payload: { fdi, isDoubleClick } }), [])

  const setProbing = useCallback((fdi, probe, value) =>
    dispatch({ type: 'SET_PROBING', payload: { fdi, probe, value } }), [])

  const saveNote = useCallback((fdi, noteType, text) =>
    dispatch({ type: 'SAVE_NOTE', payload: { fdi, noteType, text } }), [])

  const saveEndo = useCallback((fdi, tests) =>
    dispatch({ type: 'SAVE_ENDO', payload: { fdi, tests } }), [])

  const getDentalRecord = useCallback(() => ({
    patientId: 'PAT-001',
    lastUpdated: new Date().toISOString(),
    teeth: Object.fromEntries(
      FDI_LIST.map(fdi => [fdi, {
        fdi,
        history: state.teeth[fdi].history,
        notes: state.teeth[fdi].notes,
        probing: state.teeth[fdi].probing,
        endoTests: state.teeth[fdi].endoTests,
      }])
    ),
  }), [state.teeth])

  return (
    <DentalContext.Provider value={{
      state, dispatch,
      focusTooth, closeSidebar,
      setActiveTool, setActiveTab, setViewMode,
      openEditor, closeEditor, openSummary, closeSummary,
      setToolOption, applyConditionAction, applyBraceAction,
      setProbing, saveNote, saveEndo, getDentalRecord,
    }}>
      {children}
    </DentalContext.Provider>
  )
}

export function useDental() {
  const ctx = useContext(DentalContext)
  if (!ctx) throw new Error('useDental must be inside DentalProvider')
  return ctx
}
