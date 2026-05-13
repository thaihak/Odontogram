import React, { useState } from "react";
import {
  Stethoscope,
  Activity,
  Beaker,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  Calendar,
  LayoutDashboard,
  Plus,
} from "lucide-react";

// Reusable Stat Card Component with inline hover states
const StatCard = ({ label, value, icon, textHex, bgHex }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "1rem",
        border: "1px solid #f1f5f9",
        boxShadow: isHovered
          ? "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "130px",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Decorative expanding background circle */}
      <div
        style={{
          position: "absolute",
          right: "-2rem",
          top: "-2rem",
          width: "8rem",
          height: "8rem",
          borderRadius: "50%",
          backgroundColor: bgHex,
          opacity: 0.4,
          transform: isHovered ? "scale(1.5)" : "scale(1)",
          transition: "transform 0.7s ease-out",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 10,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: isHovered ? "#334155" : "#64748b",
            fontSize: "0.875rem",
            fontWeight: "500",
            transition: "color 0.3s ease",
          }}
        >
          {label}
        </h3>
        <div
          style={{
            padding: "0.625rem",
            borderRadius: "0.75rem",
            backgroundColor: bgHex,
            color: textHex,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
          }}
        >
          {icon}
        </div>
      </div>
      <div
        style={{
          fontSize: "1.875rem",
          fontWeight: "bold",
          color: "#0f172a",
          margin: 0,
          position: "relative",
          zIndex: 10,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default function Dashboard({ onNewEncounter, onBack }) {
  const [btnHover, setBtnHover] = useState(false);
  const [manualBtnHover, setManualBtnHover] = useState(false);

  const summaryCards = [
    {
      label: "Today's Encounters",
      value: "0",
      icon: <Stethoscope size={20} strokeWidth={2} />,
      textHex: "#0d9488", // Teal 600
      bgHex: "#f0fdfa", // Teal 50
    },
    {
      label: "Active Treatment Plans",
      value: "0",
      icon: <Activity size={20} strokeWidth={2} />,
      textHex: "#4f46e5", // Indigo 600
      bgHex: "#eef2ff", // Indigo 50
    },
    {
      label: "Pending Lab Cases",
      value: "0",
      icon: <Beaker size={20} strokeWidth={2} />,
      textHex: "#7c3aed", // Violet 600
      bgHex: "#f5f3ff", // Violet 50
    },
    {
      label: "Today's Revenue",
      value: "$0.00",
      icon: <DollarSign size={20} strokeWidth={2} />,
      textHex: "#059669", // Emerald 600
      bgHex: "#ecfdf5", // Emerald 50
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        backgroundImage:
          "radial-gradient(ellipse at top right, rgba(204, 251, 241, 0.4), transparent), radial-gradient(ellipse at bottom left, rgba(241, 245, 249, 0.9), transparent)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#64748b",
                padding: "0.5rem",
                borderRadius: "50%",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f1f5f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              title="Go back"
            >
              <ChevronLeft size={24} />
            </button>
          )}
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
                fontWeight: "500",
              }}
            >
              Wednesday, April 22, 2026
            </p>
          </div>
        </div>

        <button
          onClick={onNewEncounter}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            background: btnHover
              ? "linear-gradient(to right, #0f4d4a, #0d3b39)"
              : "linear-gradient(to right, #115e59, #0f4d4a)",
            color: "white",
            padding: "0.625rem 1.5rem",
            borderRadius: "9999px", // Fully rounded
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: btnHover
              ? "0 10px 15px -3px rgba(17, 94, 89, 0.2)"
              : "0 4px 6px -1px rgba(17, 94, 89, 0.1)",
            transform: btnHover ? "translateY(-1px)" : "translateY(0)",
            transition: "all 0.2s ease",
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          New Encounter
        </button>
      </header>

      {/* Main Dashboard Content */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
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
            gap: "1.5rem",
          }}
        >
          {summaryCards.map((card, idx) => (
            <StatCard key={idx} {...card} />
          ))}
        </div>

        {/* Secondary Row: Encounters and Sidebars */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          {/* Encounters Section */}
          <div
            style={{
              flex: "2 1 600px", // Takes up roughly 2/3 of space
              background: "#fff",
              border: "1px solid #f1f5f9",
              borderRadius: "1rem",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              minHeight: "400px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1.75rem",
                borderBottom: "1px solid #f8fafc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: "bold",
                  color: "#0f172a",
                }}
              >
                Today's Encounters
              </h2>
              <button
                style={{
                  background: "#f8fafc",
                  border: "none",
                  color: "#64748b",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#0d9488";
                  e.currentTarget.style.backgroundColor = "#f0fdfa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#64748b";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }}
              >
                View Schedule{" "}
                <ChevronRight size={16} style={{ marginLeft: "0.25rem" }} />
              </button>
            </div>

            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2.5rem",
                textAlign: "center",
                position: "relative",
              }}
            >
              {/* Decorative blob */}
              <div
                style={{
                  position: "absolute",
                  width: "18rem",
                  height: "18rem",
                  background: "rgba(240, 253, 250, 0.5)",
                  borderRadius: "50%",
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  width: "5rem",
                  height: "5rem",
                  background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  border: "1px solid #e2e8f0",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                <Calendar size={32} color="#94a3b8" strokeWidth={1.5} />
              </div>
              <p
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#334155",
                  fontWeight: "600",
                  fontSize: "1rem",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                No encounters scheduled for today
              </p>
              <p
                style={{
                  margin: "0 0 1.5rem 0",
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  maxWidth: "250px",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Get started by adding a new patient encounter manually to your
                schedule.
              </p>
              <button
                onClick={onNewEncounter}
                onMouseEnter={() => setManualBtnHover(true)}
                onMouseLeave={() => setManualBtnHover(false)}
                style={{
                  background: manualBtnHover ? "#f0fdfa" : "#fff",
                  border: manualBtnHover
                    ? "1px solid #99f6e4"
                    : "1px solid #ccfbf1",
                  color: "#0d9488",
                  padding: "0.5rem 1.25rem",
                  borderRadius: "9999px",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                  transition: "all 0.2s ease",
                  position: "relative",
                  zIndex: 10,
                }}
              >
                Start Manual Encounter
              </button>
            </div>
          </div>

          {/* Right Side Column (Chairs & Labs) */}
          <div
            style={{
              flex: "1 1 300px", // Takes up roughly 1/3 of space
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* Chairs Card */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #f1f5f9",
                borderRadius: "1rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: "190px",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.75rem",
                  borderBottom: "1px solid #f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    fontWeight: "bold",
                    color: "#0f172a",
                  }}
                >
                  <div
                    style={{
                      padding: "0.5rem",
                      background: "#eff6ff",
                      color: "#2563eb",
                      borderRadius: "0.5rem",
                      display: "flex",
                    }}
                  >
                    <LayoutDashboard size={18} strokeWidth={2} />
                  </div>
                  Chairs
                </div>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#94a3b8")
                  }
                >
                  Manage
                </button>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    background: "#f8fafc",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <LayoutDashboard size={20} color="#cbd5e1" />
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontStyle: "italic",
                  }}
                >
                  No chairs configured.
                </div>
              </div>
            </div>

            {/* Pending Labs Card */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #f1f5f9",
                borderRadius: "1rem",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: "190px",
              }}
            >
              <div
                style={{
                  padding: "1.25rem 1.75rem",
                  borderBottom: "1px solid #f8fafc",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontWeight: "bold",
                  color: "#0f172a",
                }}
              >
                <div
                  style={{
                    padding: "0.5rem",
                    background: "#fffbeb",
                    color: "#d97706",
                    borderRadius: "0.5rem",
                    display: "flex",
                  }}
                >
                  <Beaker size={18} strokeWidth={2} />
                </div>
                Pending Labs
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    background: "#f8fafc",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <Beaker size={20} color="#cbd5e1" />
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    fontStyle: "italic",
                  }}
                >
                  No pending lab cases.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
