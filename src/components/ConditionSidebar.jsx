import React, { useState } from 'react'
import { useDental } from '../context/DentalContext'
import ProbingTab from './tabs/ProbingTab'
import PathologyTab from './tabs/PathologyTab'
import RestorationTab from './tabs/RestorationTab'

const TABS = [
  { key: 'probing', label: 'Probing' },
  { key: 'pathology', label: 'Pathology' },
  { key: 'restoration', label: 'Restoration' },
]

export default function ConditionSidebar() {
  const { state, closeSidebar, openEditor, setActiveTab } = useDental()
  const { sidebarOpen, sidebarPosition, focusedToothFDI, activeTab, editorOpen } = state.ui

  if (!sidebarOpen && !editorOpen) return null

  const sideClass = `condition-sidebar${sidebarOpen || editorOpen ? ' show' : ''} sidebar-${editorOpen ? 'right' : sidebarPosition}`
  const history = focusedToothFDI ? (state.globalHistory[focusedToothFDI] ?? []) : []

  return (
    <div id="conditionSidebar" className={sideClass}>
      <div className="sidebar-header">
        <h3 id="sidebarTitle">{focusedToothFDI ? `Tooth ${focusedToothFDI}` : 'Conditions'}</h3>
        <button className="close-sidebar-btn" onClick={closeSidebar}>&times;</button>
      </div>

      <div className="sidebar-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab-btn${activeTab === t.key ? ' active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="tab-probing" className={`tab-content${activeTab === 'probing' ? ' active' : ''}`}>
        <ProbingTab fdi={focusedToothFDI} />
      </div>
      <div id="tab-pathology" className={`tab-content${activeTab === 'pathology' ? ' active' : ''}`}>
        <PathologyTab fdi={focusedToothFDI} />
      </div>
      <div id="tab-restoration" className={`tab-content${activeTab === 'restoration' ? ' active' : ''}`}>
        <RestorationTab fdi={focusedToothFDI} />
      </div>

      <div className="sidebar-history">
        <h4 style={{ marginBottom: 10, fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
          Tooth History
        </h4>
        <ul id="sidebarHistoryList">
          {history.length === 0 ? (
            <li style={{ padding: '10px 0', color: '#94a3b8' }}><em>No activity yet.</em></li>
          ) : history.map((log, idx) => (
            <li key={log.id ?? idx}>
              <strong style={{ color: '#94a3b8', fontSize: 11 }}>[{log.time}]</strong>{' '}
              <span style={{ color: '#334155', fontWeight: 500 }}>{log.sectionName}</span>:{' '}
              <span className={`status-badge ${log.badgeClass}`}>{log.label}</span>
              {log.extraNote ? <span style={{ fontSize: 10.5, color: '#333', display: 'block', marginTop: 2 }}>{log.extraNote}</span> : null}
            </li>
          ))}
        </ul>
      </div>

      {!editorOpen && (
        <button className="sidebar-isolate-btn" id="isolateToothBtn" onClick={openEditor}>
          Open Detailed Editor
        </button>
      )}
    </div>
  )
}
