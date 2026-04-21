import React, { useCallback } from 'react'
import { useDental } from '../context/DentalContext'
import { getToothType, isToothTight, getToothQuadrant, getToothImageSrc } from '../constants/teethData'
import SvgOverlay from './SvgOverlay'

export default function Tooth({ fdi, isUpper }) {
  const { state, focusTooth, openEditor, applyConditionAction, applyBraceAction } = useDental()
  const { focusedToothFDI, sidebarOpen, activeTool } = state.ui
  const toothData = state.teeth[fdi]
  const isFocused = focusedToothFDI === fdi && sidebarOpen

  const toothType = getToothType(fdi)
  const tight = isToothTight(fdi)
  const quad = getToothQuadrant(fdi)
  const hasBrace = toothData.hasBrace
  const useImplant = toothData.useImplantImage
  const topFractureClass = toothData.topOverlayFractureClass

  const handleToothClick = useCallback((e) => {
    e.stopPropagation()
    if (!isFocused) {
      focusTooth(fdi)
    }
  }, [isFocused, focusTooth, fdi])

  const handleSectionClick = useCallback((sectionLabel, viewType, e) => {
    e.stopPropagation()
    if (!isFocused) return
    if (activeTool === 'brace') {
      applyBraceAction(fdi, false)
    } else {
      applyConditionAction(fdi, sectionLabel, false)
    }
  }, [isFocused, activeTool, fdi, applyBraceAction, applyConditionAction])

  const handleViewDblClick = useCallback((viewType, e) => {
    e.stopPropagation()
    e.preventDefault()
    if (!isFocused) return
    if (activeTool === 'brace') {
      applyBraceAction(fdi, true)
    } else {
      applyConditionAction(fdi, null, true)
    }
  }, [isFocused, activeTool, fdi, applyBraceAction, applyConditionAction])

  const handleIsolate = useCallback((e) => {
    e.stopPropagation()
    openEditor()
  }, [openEditor])

  const classes = [
    'tooth',
    isUpper ? 'upper' : 'lower',
    `q${quad}`,
    `type-${toothType}`,
    tight ? 'tight' : '',
    isFocused ? 'focused-tooth' : '',
  ].filter(Boolean).join(' ')

  // View order: upper = normal, top, normalBack; lower = normalBack, top, normal
  const viewOrder = isUpper
    ? ['normal', 'top', 'normalBack']
    : ['normalBack', 'top', 'normal']

  const probing = toothData.probing

  return (
    <div className={classes} data-fdi={fdi} onClick={handleToothClick}>
      <div className="tooth-number-wrapper">
        <div className="tooth-number">{fdi}</div>
        <div className="probing-indicators">
          <div className={`probe-dot plaque${probing.plaque ? ' active' : ''}`} title="Plaque" />
          <div className={`probe-dot bleeding${probing.bleeding ? ' active' : ''}`} title="Bleeding" />
          <div className={`probe-dot pus${probing.pus ? ' active' : ''}`} title="Pus" />
          <div className={`probe-dot tartar${probing.tartar ? ' active' : ''}`} title="Tartar" />
        </div>
      </div>

      <div className="tooth-views">
        {viewOrder.map(viewType => (
          <ToothViewItem
            key={viewType}
            viewType={viewType}
            fdi={fdi}
            toothType={toothType}
            isUpper={isUpper}
            hasBrace={hasBrace}
            useImplant={useImplant}
            pathConditions={toothData.pathConditions[viewType]}
            topFractureClass={viewType === 'top' ? topFractureClass : null}
            isFocused={isFocused}
            onSectionClick={handleSectionClick}
            onDblClick={handleViewDblClick}
          />
        ))}
      </div>
    </div>
  )
}

function ToothViewItem({ viewType, fdi, toothType, isUpper, hasBrace, useImplant, pathConditions, topFractureClass, isFocused, onSectionClick, onDblClick }) {
  const imgSrc = getToothImageSrc(fdi, viewType, useImplant)
  const braceImgSrc = hasBrace === 'rubber' ? '/brace/brace-rubber-bands.png' : '/brace/brace.png'

  return (
    <div
      className={`tooth-view-item ${viewType === 'normalBack' ? 'normal-back' : viewType}`}
      onDoubleClick={(e) => onDblClick(viewType, e)}
    >
      <img src={imgSrc} alt={`${viewType} view tooth ${fdi}`} />
      {viewType === 'normal' && (
        <img
          className="brace-overlay"
          src={braceImgSrc}
          alt={`Braces tooth ${fdi}`}
          style={{ display: hasBrace ? 'block' : 'none' }}
        />
      )}
      <SvgOverlay
        viewType={viewType}
        toothType={toothType}
        fdi={fdi}
        pathConditions={pathConditions}
        topFractureClass={topFractureClass}
        isFocused={isFocused}
        onSectionClick={(label, e) => onSectionClick(label, viewType, e)}
      />
    </div>
  )
}
