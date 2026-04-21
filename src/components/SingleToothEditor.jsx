import React, { useCallback } from 'react'
import { useDental } from '../context/DentalContext'
import { getToothType, isUpperTooth, getToothQuadrant, getToothImageSrc } from '../constants/teethData'
import SvgOverlay from './SvgOverlay'

export default function SingleToothEditor() {
  const { state, closeEditor, closeSidebar, applyConditionAction, applyBraceAction } = useDental()
  const { editorOpen, focusedToothFDI, activeTool } = state.ui

  if (!editorOpen || !focusedToothFDI) return null

  const fdi = focusedToothFDI
  const toothType = getToothType(fdi)
  const isUpper = isUpperTooth(fdi)
  const quad = getToothQuadrant(fdi)
  const toothData = state.teeth[fdi]

  const quadrantMap = { 1: 'Upper Right Quadrant', 2: 'Upper Left Quadrant', 3: 'Lower Left Quadrant', 4: 'Lower Right Quadrant' }
  const quadrantLabel = quadrantMap[quad] ?? 'Focused Tooth View'
  const archLabel = isUpper ? 'Upper Arch' : 'Lower Arch'
  const typeLabel = toothType === 'molar' ? 'Molar' : toothType === 'premolar' ? 'Premolar' : 'Incisor / Canine'
  const toolLabel = activeTool.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const handleBack = useCallback(() => {
    closeEditor()
    closeSidebar()
  }, [closeEditor, closeSidebar])

  const handleSectionClick = useCallback((sectionLabel) => {
    if (activeTool === 'brace') applyBraceAction(fdi, false)
    else applyConditionAction(fdi, sectionLabel, false)
  }, [activeTool, fdi, applyBraceAction, applyConditionAction])

  const handleDblClick = useCallback((e) => {
    e.preventDefault()
    if (activeTool === 'brace') applyBraceAction(fdi, true)
    else applyConditionAction(fdi, null, true)
  }, [activeTool, fdi, applyBraceAction, applyConditionAction])

  const viewOrder = isUpper ? ['normal', 'top', 'normalBack'] : ['normalBack', 'top', 'normal']

  return (
    <div id="singleToothView" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="screen-header">
        <div className="screen-header-main">
          <div className="screen-kicker">Clinical Detail Editor</div>
          <h2 className="single-tooth-title" id="singleToothTitle">Tooth {fdi} Clinical Editor</h2>
          <p className="single-tooth-subtitle" id="singleToothSubtitle">
            {quadrantLabel} · {archLabel} · {typeLabel} surface review and treatment charting.
          </p>
          <div className="editor-meta-strip">
            <span className="editor-meta-chip" id="singleToothQuadrant">{quadrantLabel}</span>
            <span className="editor-meta-chip" id="singleToothType">{typeLabel}</span>
            <span className="editor-meta-chip" id="singleToothActiveToolMetric">{toolLabel}</span>
          </div>
        </div>
        <button className="back-btn" id="backToChartBtn" onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Chart
        </button>
      </div>

      <div className="editor-layout">
        <section className="editor-spotlight-panel">
          <div className="editor-card-head">
            <div>
              <span className="panel-kicker">Tooth Focus</span>
              <h3>Surface Mapping Canvas</h3>
            </div>
            <span className="editor-state-pill" id="singleToothActiveTool">{toolLabel}</span>
          </div>

          <div id="singleToothEditor">
            {/* Render the focused tooth enlarged */}
            <div
              className={`tooth ${isUpper ? 'upper' : 'lower'} q${quad} type-${toothType} focused-tooth in-editor`}
              onDoubleClick={handleDblClick}
            >
              <div className="tooth-number-wrapper">
                <div className="tooth-number">{fdi}</div>
                <div className="probing-indicators">
                  {['plaque', 'bleeding', 'pus', 'tartar'].map(p => (
                    <div key={p} className={`probe-dot ${p}${toothData.probing[p] ? ' active' : ''}`} title={p} />
                  ))}
                </div>
              </div>
              <div className="tooth-views">
                {viewOrder.map(viewType => {
                  const imgSrc = getToothImageSrc(fdi, viewType, toothData.useImplantImage)
                  const hasBrace = toothData.hasBrace
                  const braceImgSrc = hasBrace === 'rubber' ? '/brace/brace-rubber-bands.png' : '/brace/brace.png'
                  return (
                    <div key={viewType} className={`tooth-view-item ${viewType === 'normalBack' ? 'normal-back' : viewType}`}>
                      <img src={imgSrc} alt={`${viewType} view tooth ${fdi}`} />
                      {viewType === 'normal' && (
                        <img className="brace-overlay" src={braceImgSrc} alt={`Braces tooth ${fdi}`} style={{ display: hasBrace ? 'block' : 'none' }} />
                      )}
                      <SvgOverlay
                        viewType={viewType}
                        toothType={toothType}
                        fdi={fdi}
                        pathConditions={toothData.pathConditions[viewType]}
                        topFractureClass={viewType === 'top' ? toothData.topOverlayFractureClass : null}
                        isFocused={true}
                        onSectionClick={(label, e) => { e.stopPropagation(); handleSectionClick(label) }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="editor-spotlight-note">
            Click the tooth surfaces directly to chart findings. Use the condition sidebar to switch between
            pathology, restoration, and probing tools while staying in this focused clinical view.
          </div>
        </section>

        <div className="editor-right-panel">
          <div className="editor-panel-header">
            <span className="panel-kicker">Chairside Review</span>
            <h3>Treatment Details &amp; Notes</h3>
            <p>Active tool: <strong>{toolLabel}</strong></p>
          </div>

          <div className="editor-history-section">
            <h4>Tooth {fdi} — Recorded Actions</h4>
            <ul className="editor-history-list">
              {(state.globalHistory[fdi] ?? []).map((log, i) => (
                <li key={log.id ?? i}>
                  <strong style={{ color: '#94a3b8', fontSize: 11 }}>[{log.time}]</strong>{' '}
                  <span style={{ color: '#334155', fontWeight: 500 }}>{log.sectionName}</span>:{' '}
                  <span className={`status-badge ${log.badgeClass}`}>{log.label}</span>
                </li>
              ))}
              {!state.globalHistory[fdi]?.length && (
                <li style={{ color: '#94a3b8' }}><em>No activity yet.</em></li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
