import React, { useRef } from "react";
import { useDental } from "../context/DentalContext";
import Arch from "./Arch";
import BraceWires from "./BraceWires";

const LEGEND_ITEMS = [
  { label: "Healthy", style: { background: "#e3ddc7" } },
  {
    label: "Decay",
    style: { background: "rgba(229,115,115,0.6)", borderColor: "#e53935" },
  },
  { label: "Fracture", className: "legend-pattern" },
  { label: "Wear", className: "legend-color pattern-wear-bg" },
  {
    label: "To be Extracted",
    style: { background: "rgba(239,68,68,0.1)", border: "1px dashed #ef4444" },
  },
  {
    label: "Missing",
    style: {
      background: "rgba(255,255,255,0.85)",
      border: "1px dashed #94a3b8",
    },
  },
  {
    label: "Implant",
    style: { background: "transparent", border: "2px dashed #64748b" },
  },
  {
    label: "Braces",
    style: { background: "#f8fafc", border: "2px solid #cbd5e1" },
  },
  { label: "Veneer", style: { background: "#e0f2fe", borderColor: "#0284c7" } },
  { label: "Pontic", style: { background: "#1e293b", borderColor: "#0f172a" } },
  {
    label: "Endo Tests",
    style: { background: "rgba(156,39,176,0.5)", borderColor: "#7e22ce" },
  },
  {
    label: "Tooth Eruption",
    style: { background: "rgba(34,197,94,0.4)", borderColor: "#16a34a" },
  },
  { label: "Treated", style: { background: "#e0e0ff" } },
];

export default function OdontogramChart() {
  const { state, setViewMode, openSummary } = useDental();
  const { viewMode, editorOpen } = state.ui;
  const upperRef = useRef(null);
  const lowerRef = useRef(null);

  if (editorOpen) return null;

  return (
    <div id="mainView">
      <div className="container">
        <h1 className="chart-title">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#3b82f6">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3S13.66 11 12 11s-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
          Odontogram — Dental Chart System
        </h1>

        <div className="controls">
          {[
            { view: "upper", label: "Upper" },
            { view: "lower", label: "Lower" },
            { view: "all", label: "All" },
          ].map(({ view, label }) => (
            <button
              key={view}
              className={`view-btn${viewMode === view ? " active" : ""}`}
              onClick={() => setViewMode(view)}
            >
              {label}
            </button>
          ))}
          <button className="view-btn summary-btn" onClick={openSummary}>
            Summary &amp; Export
          </button>
        </div>

        <div
          className={`odontogram${state.ui.sidebarOpen ? " focus-mode" : ""}`}
        >
          <div className={`arch${viewMode === "lower" ? " hidden" : ""}`}>
            <div className="arch-label">UPPER</div>
            <div
              className="arch-content"
              ref={upperRef}
              style={{ position: "relative" }}
            >
              <BraceWires archRef={upperRef} archType="upper" />
              <Arch archType="upper" viewMode={viewMode} />
            </div>
          </div>

          <div className={`arch${viewMode === "upper" ? " hidden" : ""}`}>
            <div className="arch-label">LOWER</div>
            <div
              className="arch-content"
              ref={lowerRef}
              style={{ position: "relative" }}
            >
              <BraceWires archRef={lowerRef} archType="lower" />
              <Arch archType="lower" viewMode={viewMode} />
            </div>
          </div>
        </div>

        <div className="legend">
          <h3>Legend</h3>
          {LEGEND_ITEMS.map((item) => (
            <div key={item.label} className="legend-item">
              <span
                className={item.className ?? "legend-color"}
                style={item.style}
              />
              <span>{item.label}</span>
            </div>
          ))}
          <br />
          <br />
          <small>
            <strong>FDI Numbering System:</strong>
            <br />
            Upper Right (Screen Left): 18–11 | Upper Left (Screen Right): 21–28
            <br />
            Lower Right (Screen Left): 48–41 | Lower Left (Screen Right): 31–38
            <br />
            <strong>Tip:</strong> <strong>Click a Tooth</strong> to focus it and
            open the side tool palette. Select a condition, then click tooth
            sections to apply it. <strong>Crown fractures</strong> map to the
            Top View. <strong>Root fractures</strong> map to the root.
          </small>
        </div>

        {/* Global action log */}
        <ActionLog />
      </div>
    </div>
  );
}

function ActionLog() {
  const { state } = useDental();
  const logs = state.actionLog.slice(0, 8);

  if (logs.length === 0) return null;

  return (
    <div className="action-log-section">
      <h4 className="action-log-title">Recent Actions</h4>
      <ul id="actionLogList" className="action-log-list">
        {logs.map((log) => (
          <li key={log.id}>
            <strong style={{ color: "#888" }}>[{log.time}]</strong> Tooth{" "}
            <strong>{log.toothFDI}</strong>:{" "}
            <span style={{ color: "#222", fontWeight: 500 }}>
              {log.sectionName}
            </span>{" "}
            marked as{" "}
            <span className={`status-badge ${log.badgeClass}`}>
              {log.label}
            </span>
            {log.extraNote ? (
              <span
                style={{
                  fontSize: 10.5,
                  fontWeight: "normal",
                  marginTop: 4,
                  color: "#333",
                  lineHeight: 1.3,
                  display: "block",
                }}
              >
                {log.extraNote}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
