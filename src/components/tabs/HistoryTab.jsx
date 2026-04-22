import React from "react";

export default function HistoryTab({ fdi, history }) {
  if (!history || history.length === 0) {
    return (
      <div
        style={{
          padding: "2rem 1rem",
          textAlign: "center",
          color: "#94a3b8",
          fontStyle: "italic",
        }}
      >
        No history for this tooth yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {history.map((entry, idx) => (
        <div
          key={idx}
          style={{
            padding: "0.75rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "0.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "#64748b",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "0.5rem",
            }}
          >
            {entry.time}
          </div>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#0f172a",
              marginBottom: "0.25rem",
            }}
          >
            {entry.sectionName}
          </div>
          <span
            className={`status-badge ${entry.badgeClass}`}
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
              fontWeight: "600",
            }}
          >
            {entry.label}
          </span>
          {entry.extraNote && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginTop: "0.5rem",
                fontStyle: "italic",
                lineHeight: "1.4",
              }}
            >
              {entry.extraNote}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
