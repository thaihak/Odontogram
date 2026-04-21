import React from 'react'
import { useDental } from '../../context/DentalContext'
import { getToothType } from '../../constants/teethData'

export default function RestorationTab({ fdi }) {
  const { state, setActiveTool, setToolOption } = useDental()
  const { activeTool } = state.ui
  const opts = state.toolOptions.restoration

  const toothType = fdi ? getToothType(fdi) : 'normal'
  const isMolarOrPremolar = toothType === 'molar' || toothType === 'premolar'
  const restTypes = isMolarOrPremolar
    ? ['Filling', 'Inlay', 'Onlay', 'Veneer', 'Pontic', 'Partial Crown', 'Crown']
    : ['Filling', 'Veneer', 'Pontic', 'Crown']

  return (
    <div>
      <div className="tool-section-title">Restoration Tools</div>
      <div className="tool-selector">
        <label className={`tool-btn${activeTool === 'treated' ? ' active' : ''}`}>
          <input type="radio" name="conditionTool" value="treated" checked={activeTool === 'treated'} onChange={() => setActiveTool('treated')} />
          <span className="tool-color" style={{ background: '#b3b3ff' }} />
          Treated/Fill
        </label>
        <label className={`tool-btn${activeTool === 'healthy' ? ' active' : ''}`}>
          <input type="radio" name="conditionTool" value="healthy" checked={activeTool === 'healthy'} onChange={() => setActiveTool('healthy')} />
          <span className="tool-color" style={{ background: '#e3ddc7' }} />
          Clear/Healthy
        </label>
      </div>

      {activeTool === 'treated' && (
        <div style={{ marginBottom: 20, padding: 12, background: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#1d4ed8', marginBottom: 10, textTransform: 'uppercase' }}>
            Restoration Details
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: '#444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Type:</strong>
              <select className="custom-select" value={opts.type} onChange={e => setToolOption('restoration', 'type', e.target.value)}>
                {restTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Material:</strong>
              <select className="custom-select" value={opts.material} onChange={e => setToolOption('restoration', 'material', e.target.value)}>
                <option>Composite</option>
                <option>Ceramic</option>
                <option>Amalgam</option>
                <option>Gold</option>
                <option>Non-precious metal</option>
                <option>Temporary</option>
                <option>Hall</option>
                <option value="PFM">PFM (Standard)</option>
                <option value="PFM - Zirconia">PFM - Zirconia</option>
                <option value="PFM - Metal">PFM - Base Metal</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Quality:</strong>
              <select className="custom-select" value={opts.quality} onChange={e => setToolOption('restoration', 'quality', e.target.value)}>
                <option>Sufficient</option><option>Uncertain</option><option>Insufficient</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Detail:</strong>
              <select className="custom-select" value={opts.detail} onChange={e => setToolOption('restoration', 'detail', e.target.value)}>
                <option>None</option><option>Overhang</option><option>Flush</option><option>Shortfall</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
