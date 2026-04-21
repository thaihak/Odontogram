import React, { useState } from 'react'
import { useDental } from '../../context/DentalContext'

const TOOLS = [
  { value: 'decay', label: 'Decay', swatch: { background: 'rgba(229,115,115,0.6)', borderColor: '#e53935' } },
  { value: 'fracture', label: 'Fracture', swatch: { background: '#ffb74d' } },
  { value: 'wear', label: 'Wear', swatchClass: 'pattern-wear-bg' },
  { value: 'discoloration', label: 'Discolor', swatch: { background: 'linear-gradient(45deg,#e0e0e0 33%,#ffcdd2 33%,#ffcdd2 66%,#fff9c4 66%)' } },
  { value: 'to-be-extracted', label: 'Extract', swatch: { background: 'rgba(239,68,68,0.1)', border: '1px dashed #ef4444' } },
  { value: 'missing', label: 'Missing', swatch: { background: 'rgba(255,255,255,0.85)', border: '1px dashed #94a3b8' } },
  { value: 'implant', label: 'Implant', swatch: { background: 'transparent', border: '2px dashed #64748b' } },
  { value: 'brace', label: 'Braces', swatch: { background: '#f8fafc', border: '2px solid #cbd5e1' } },
  { value: 'veneer', label: 'Veneer', swatch: { background: '#e0f2fe', borderColor: '#0284c7' } },
  { value: 'pontic', label: 'Pontic', swatch: { background: '#1e293b' } },
  { value: 'endo', label: 'Endo Tests', swatch: { background: 'rgba(156,39,176,0.5)', borderColor: '#7e22ce' } },
  { value: 'eruption', label: 'Eruption', swatch: { background: 'rgba(34,197,94,0.4)', borderColor: '#16a34a' } },
  { value: 'apical', label: 'Apical', swatch: { background: 'rgba(156,39,176,0.3)', borderColor: '#7e22ce' } },
]

export default function PathologyTab({ fdi }) {
  const { state, setActiveTool, setToolOption, saveNote, saveEndo } = useDental()
  const { activeTool } = state.ui
  const opts = state.toolOptions

  const [endoSaved, setEndoSaved] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)

  const note = fdi ? state.teeth[fdi]?.notes : {}

  function handleSaveEndo() {
    if (!fdi) return
    saveEndo(fdi, opts.endo)
    setEndoSaved(true)
    setTimeout(() => setEndoSaved(false), 2000)
  }

  function handleSaveNote(noteType, textareaId) {
    if (!fdi) return
    const el = document.getElementById(textareaId)
    if (el) saveNote(fdi, noteType, el.value.trim())
    setNoteSaved(true)
    setTimeout(() => setNoteSaved(false), 2000)
  }

  return (
    <div>
      <div className="tool-section-title">Pathology Tools</div>
      <div className="tool-selector">
        {TOOLS.map(t => (
          <label key={t.value} className={`tool-btn${activeTool === t.value ? ' active' : ''}`}>
            <input
              type="radio"
              name="conditionTool"
              value={t.value}
              checked={activeTool === t.value}
              onChange={() => setActiveTool(t.value)}
            />
            <span className={`tool-color${t.swatchClass ? ` ${t.swatchClass}` : ''}`} style={t.swatch} />
            {t.label}
          </label>
        ))}
      </div>

      {/* Decay details */}
      {activeTool === 'decay' && (
        <SubPanel bg="#fff5f5" border="#ffcdd2" titleColor="#c62828" title="Decay Details">
          <Row label="Extent">
            <select className="custom-select" value={opts.decay.extent} onChange={e => setToolOption('decay', 'extent', e.target.value)}>
              <option value="Single">Single Surface</option>
              <option value="Crown">Whole Crown</option>
            </select>
          </Row>
          <Row label="Stage">
            <select className="custom-select" value={opts.decay.stage} onChange={e => setToolOption('decay', 'stage', e.target.value)}>
              <option>Enamel</option><option>Dentin</option>
            </select>
          </Row>
          <Row label="Cavitation">
            <select className="custom-select" value={opts.decay.cavitation} onChange={e => setToolOption('decay', 'cavitation', e.target.value)}>
              <option>No</option><option>Yes</option>
            </select>
          </Row>
          <Row label="Pulp">
            <select className="custom-select" value={opts.decay.pulp} onChange={e => setToolOption('decay', 'pulp', e.target.value)}>
              <option>Not Involved</option><option>Involved</option>
            </select>
          </Row>
          <Row label="Level">
            <select className="custom-select" value={opts.decay.level} onChange={e => setToolOption('decay', 'level', e.target.value)}>
              <option>C1</option><option>C2</option><option>C3</option><option>C4</option>
            </select>
          </Row>
        </SubPanel>
      )}

      {/* Fracture */}
      {activeTool === 'fracture' && (
        <SubPanel bg="#fff8e1" border="#ffe082" titleColor="#e65100" title="Fracture Details">
          <div className="pill-group">
            {['Crown', 'Root'].map(v => (
              <label key={v}>
                <input type="radio" name="fracLocation" value={v} checked={opts.fracture.location === v} onChange={() => setToolOption('fracture', 'location', v)} />
                <span className="pill-btn">{v}</span>
              </label>
            ))}
          </div>
          <div className="pill-group">
            {['Vertical', 'Horizontal'].map(v => (
              <label key={v}>
                <input type="radio" name="fracDirection" value={v} checked={opts.fracture.direction === v} onChange={() => setToolOption('fracture', 'direction', v)} />
                <span className="pill-btn">{v}</span>
              </label>
            ))}
          </div>
        </SubPanel>
      )}

      {/* Wear */}
      {activeTool === 'wear' && (
        <SubPanel bg="#fffde7" border="#fff59d" titleColor="#f57f17" title="Wear Details">
          <div className="pill-group">
            {['Abrasion', 'Erosion'].map(v => (
              <label key={v}>
                <input type="radio" name="wearType" value={v} checked={opts.wear.type === v} onChange={() => setToolOption('wear', 'type', v)} />
                <span className="pill-btn">{v}</span>
              </label>
            ))}
          </div>
          <div className="pill-group">
            {[{ v: 'Buccal', label: 'Buccal/Facial' }, { v: 'Palatal', label: 'Palatal/Lingual' }].map(({ v, label }) => (
              <label key={v}>
                <input type="radio" name="wearSurface" value={v} checked={opts.wear.surface === v} onChange={() => setToolOption('wear', 'surface', v)} />
                <span className="pill-btn">{label}</span>
              </label>
            ))}
          </div>
        </SubPanel>
      )}

      {/* Discoloration */}
      {activeTool === 'discoloration' && (
        <SubPanel bg="#f8fafc" border="#e2e8f0" titleColor="#475569" title="Discoloration Color">
          <div className="pill-group">
            {['gray', 'red', 'yellow'].map(v => (
              <label key={v}>
                <input type="radio" name="discolorColor" value={v} checked={opts.discoloration.color === v} onChange={() => setToolOption('discoloration', 'color', v)} />
                <span className="pill-btn">{v.charAt(0).toUpperCase() + v.slice(1)}</span>
              </label>
            ))}
          </div>
        </SubPanel>
      )}

      {/* Implant */}
      {activeTool === 'implant' && (
        <SubPanel bg="#f8fafc" border="#cbd5e1" titleColor="#334155" title="Implant Options">
          <Row label="Metal Type">
            <select className="custom-select" value={opts.implant.material} onChange={e => setToolOption('implant', 'material', e.target.value)}>
              <option>Titanium</option><option>Zirconia</option><option>Titanium Alloy</option>
            </select>
          </Row>
        </SubPanel>
      )}

      {/* Brace */}
      {activeTool === 'brace' && (
        <SubPanel bg="#f8fafc" border="#cbd5e1" titleColor="#334155" title="Brace Options">
          <Row label="Type">
            <select className="custom-select" value={opts.brace.type} onChange={e => setToolOption('brace', 'type', e.target.value)}>
              <option value="standard">Standard Bracket</option>
              <option value="rubber">With Rubber Bands</option>
            </select>
          </Row>
        </SubPanel>
      )}

      {/* Endo Tests */}
      {activeTool === 'endo' && (
        <SubPanel bg="#fdf4ff" border="#f5d0fe" titleColor="#c026d3" title="Endo Tests Details">
          <Row label="Cold">
            <select className="custom-select" id="endoCold" value={opts.endo.cold} onChange={e => setToolOption('endo', 'cold', e.target.value)}>
              <option>Not applicable</option><option>Positive</option><option>Uncertain</option><option>Negative</option>
            </select>
          </Row>
          <Row label="Percussion">
            <select className="custom-select" id="endoPercussion" value={opts.endo.percussion} onChange={e => setToolOption('endo', 'percussion', e.target.value)}>
              <option>Not painful</option><option>Unpleasant</option><option>Painful</option>
            </select>
          </Row>
          <Row label="Palpation">
            <select className="custom-select" id="endoPalpation" value={opts.endo.palpation} onChange={e => setToolOption('endo', 'palpation', e.target.value)}>
              <option>Not painful</option><option>Unpleasant</option><option>Painful</option>
            </select>
          </Row>
          <Row label="Heat">
            <select className="custom-select" id="endoHeat" value={opts.endo.heat} onChange={e => setToolOption('endo', 'heat', e.target.value)}>
              <option>Not applicable</option><option>Positive</option><option>Uncertain</option><option>Negative</option>
            </select>
          </Row>
          <Row label="Electricity">
            <select className="custom-select" id="endoElectricity" value={opts.endo.electricity} onChange={e => setToolOption('endo', 'electricity', e.target.value)}>
              <option value="">CHOOSE RESULT</option>
              {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n}>{n}</option>)}
            </select>
          </Row>
          <button
            type="button"
            className="save-note-btn"
            style={{ background: endoSaved ? '#10b981' : '#c026d3', marginTop: 10 }}
            onClick={handleSaveEndo}
          >
            {endoSaved ? 'Saved!' : 'Save Endo Results'}
          </button>
        </SubPanel>
      )}

      {/* Eruption / Dev Disorder */}
      {(activeTool === 'eruption' || activeTool === 'devdisorder') && (
        <SubPanel bg="#f0fdf4" border="#bbf7d0" titleColor="#16a34a" title="Tooth Eruption Notes">
          <textarea
            className="custom-textarea"
            id="devDisorderNote"
            placeholder="Add eruption or disorder comments for this tooth..."
            defaultValue={note?.devDisorder ?? ''}
          />
          <button
            type="button"
            className="save-note-btn"
            style={{ background: noteSaved ? '#10b981' : '#16a34a' }}
            onClick={() => handleSaveNote('devDisorder', 'devDisorderNote')}
          >
            {noteSaved ? 'Saved!' : 'Save Note'}
          </button>
        </SubPanel>
      )}

      {/* Apical */}
      {activeTool === 'apical' && (
        <SubPanel bg="#fdf4ff" border="#f5d0fe" titleColor="#a21caf" title="Apical Condition Notes">
          <textarea
            className="custom-textarea"
            id="apicalNote"
            placeholder="Add apical condition notes for this tooth..."
            defaultValue={note?.apical ?? ''}
          />
          <button
            type="button"
            className="save-note-btn"
            style={{ background: noteSaved ? '#10b981' : '#a21caf' }}
            onClick={() => handleSaveNote('apical', 'apicalNote')}
          >
            {noteSaved ? 'Saved!' : 'Save Note'}
          </button>
        </SubPanel>
      )}
    </div>
  )
}

function SubPanel({ bg, border, titleColor, title, children }) {
  return (
    <div style={{ marginBottom: 20, padding: 12, background: bg, borderRadius: 6, border: `1px solid ${border}` }}>
      <div style={{ fontSize: 11, fontWeight: 'bold', color: titleColor, marginBottom: 10, textTransform: 'uppercase' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: '#444' }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <strong>{label}:</strong>
      {children}
    </div>
  )
}
