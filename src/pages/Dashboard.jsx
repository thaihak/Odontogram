import React from "react";
import {
  Stethoscope,
  Activity,
  Beaker,
  DollarSign,
  ChevronRight,
  Calendar,
  LayoutDashboard,
  Plus,
} from "lucide-react";

export default function Dashboard({ onNewEncounter }) {
  const summaryCards = [
    {
      label: "Today's Encounters",
      value: "0",
      icon: <Stethoscope size={20} />,
      iconClass: "icon-blue",
    },
    {
      label: "Active Treatment Plans",
      value: "0",
      icon: <Activity size={20} />,
      iconClass: "icon-purple",
    },
    {
      label: "Pending Lab Cases",
      value: "0",
      icon: <Beaker size={20} />,
      iconClass: "icon-amber",
    },
    {
      label: "Today's Revenue",
      value: "$0.00",
      icon: <DollarSign size={20} />,
      iconClass: "icon-emerald",
      valueClass: "text-emerald",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* HEADER IS NOW INSIDE THE DASHBOARD */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem",
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#0f172a",
            }}
          >
            Dental OS
          </h1>
          <p
            style={{
              margin: "0.25rem 0 0 0",
              fontSize: "0.875rem",
              color: "#64748b",
            }}
          >
            Wednesday, April 22, 2026
          </p>
        </div>
        <button
          onClick={onNewEncounter}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#0D6466",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          <Plus size={18} />
          New Encounter
        </button>
      </header>

      {/* Main Dashboard Content */}
      <div
        style={{
          padding: "1.5rem",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Summary Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          {summaryCards.map((card, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                height: "8rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  {card.label}
                </span>
                <div className={`card-icon-wrapper ${card.iconClass}`}>
                  {card.icon}
                </div>
              </div>
              <div
                className={`card-value ${card.valueClass || ""}`}
                style={{ fontSize: "1.875rem", fontWeight: "bold" }}
              >
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Row: Encounters and Sidebars */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              minHeight: "300px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "1.25rem",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{ margin: 0, fontSize: "1.125rem", fontWeight: "bold" }}
              >
                Today's Encounters
              </h2>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#475569",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                View Schedule <ChevronRight size={16} />
              </button>
            </div>
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
              }}
            >
              <Calendar
                size={48}
                style={{ opacity: 0.5, marginBottom: "1rem" }}
              />
              <p style={{ fontStyle: "italic", margin: "0 0 1rem 0" }}>
                No encounters scheduled for today.
              </p>
              <button
                onClick={onNewEncounter}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0D6466",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Start a new manual encounter
              </button>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
              }}
            >
              <div
                style={{
                  padding: "1.25rem",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: "bold",
                  }}
                >
                  <LayoutDashboard size={18} color="#64748b" /> Chairs
                </div>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Manage
                </button>
              </div>
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontStyle: "italic",
                  fontSize: "0.875rem",
                }}
              >
                No chairs configured.
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "0.75rem",
              }}
            >
              <div
                style={{
                  padding: "1.25rem",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "bold",
                }}
              >
                <Beaker size={18} color="#64748b" /> Pending Labs
              </div>
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontStyle: "italic",
                  fontSize: "0.875rem",
                }}
              >
                No pending lab cases.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
