import React, { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Settings,
  X,
} from "lucide-react";

// --- INITIAL DATA ---
const INITIAL_PATIENTS = [
  {
    idNumber: "260421-001",
    name: "Sokha Chea",
    dob: "March 31, 1996",
    address: "Toul Kork, Phnom Penh",
  },
  {
    idNumber: "260421-002",
    name: "Mony Sovann",
    dob: "March 21, 2003",
    address: "Daun Penh, Phnom Penh",
  },
  {
    idNumber: "260421-003",
    name: "Bopha Heng",
    dob: "August 12, 1988",
    address: "Chamkar Mon, Phnom Penh",
  },
  {
    idNumber: "260421-004",
    name: "Rithy Ouk",
    dob: "November 05, 1975",
    address: "7 Makara, Phnom Penh",
  },
  {
    idNumber: "260421-005",
    name: "Chenda Meas",
    dob: "April 15, 1990",
    address: "Chbar Ampov, Phnom Penh",
  },
  {
    idNumber: "260421-006",
    name: "Makara Tep",
    dob: "January 22, 1982",
    address: "Sen Sok, Phnom Penh",
  },
];

// --- MODAL COMPONENT ---
// Included inline here for the preview environment
const NewPatientModal = ({ isOpen, onClose, onSave, patientCount }) => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    address: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIdNum = `260421-${String(patientCount + 1).padStart(3, "0")}`;
    onSave({ ...formData, idNumber: newIdNum });
    setFormData({ name: "", dob: "", address: "" });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.4)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "1.5rem",
          width: "100%",
          maxWidth: "450px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a" }}>
            Add New Patient
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              display: "flex",
            }}
          >
            <X size={20} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#475569",
                marginBottom: "0.5rem",
              }}
            >
              Full Name
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="e.g., Sokha Chea"
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#475569",
                marginBottom: "0.5rem",
              }}
            >
              Date of Birth
            </label>
            <input
              required
              type="text"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="e.g., March 31, 1996"
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#475569",
                marginBottom: "0.5rem",
              }}
            >
              Address
            </label>
            <input
              required
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.75rem",
                border: "1px solid #e2e8f0",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="e.g., Toul Kork, Phnom Penh"
            />
          </div>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "9999px",
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#475569",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "9999px",
                border: "none",
                background: "#0d9488",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- REUSABLE PATIENT ROW ---
const PatientRow = ({ patient, index, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [actionHover, setActionHover] = useState(false);

  return (
    <div
      onClick={() => onSelect && onSelect(patient)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "#fff",
        padding: "1rem 1.5rem",
        borderRadius: "1rem",
        border: "1px solid #f1f5f9",
        boxShadow: isHovered
          ? "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.02)",
        display: "grid",
        gridTemplateColumns: "60px 2fr 1.5fr 1.5fr 2fr 50px",
        alignItems: "center",
        gap: "1rem",
        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        marginBottom: "0.75rem",
      }}
    >
      {/* Avatar / Number */}
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          backgroundColor: isHovered ? "#0d9488" : "#f0fdfa",
          color: isHovered ? "#fff" : "#0d9488",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "0.875rem",
          transition: "all 0.3s ease",
        }}
      >
        {index + 1}
      </div>

      <div style={{ fontWeight: "600", color: "#0f172a", fontSize: "0.95rem" }}>
        {patient.name}
      </div>

      <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
        {patient.idNumber}
      </div>

      <div style={{ color: "#64748b", fontSize: "0.875rem" }}>
        {patient.dob}
      </div>

      <div
        style={{
          color: "#64748b",
          fontSize: "0.875rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {patient.address}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click when clicking actions
          }}
          onMouseEnter={() => setActionHover(true)}
          onMouseLeave={() => setActionHover(false)}
          style={{
            background: actionHover ? "#f1f5f9" : "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            color: actionHover ? "#0f172a" : "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          <MoreHorizontal size={20} />
        </button>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
export default function PatientsList({ onPatientSelect, onBack }) {
  // STATE MANAGEMENT
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // UI STATES
  const [btnHover, setBtnHover] = useState(false);
  const [activeTab, setActiveTab] = useState("PATIENTS");
  const [searchFocused, setSearchFocused] = useState(false);

  const tabs = ["PATIENTS"];

  // LOGIC
  const handleSavePatient = (newPatientData) => {
    try {
      setPatients((prevPatients) => [...prevPatients, newPatientData]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error handling save patient:", error);
      alert("Error adding patient. Please try again.");
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.idNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
      {/* Top Navigation Bar */}
      <header
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "0 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          height: "4rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            height: "100%",
          }}
        >
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
                marginLeft: "-0.5rem",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f1f5f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Tabs */}
          <nav style={{ display: "flex", height: "100%", gap: "2rem" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom:
                    activeTab === tab
                      ? "3px solid #0d9488"
                      : "3px solid transparent",
                  color: activeTab === tab ? "#0d9488" : "#64748b",
                  fontWeight: activeTab === tab ? "700" : "600",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  padding: "0 0.5rem",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.05em",
                }}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile Area */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            style={{ fontSize: "0.95rem", fontWeight: "500", color: "#334155" }}
          >
            Hak
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              padding: "0.5rem",
              borderRadius: "50%",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f1f5f9")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
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
        {/* Action Bar (Search & New Patient) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Search Input tied to State */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "400px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "1rem",
                color: searchFocused ? "#0d9488" : "#94a3b8",
                transition: "color 0.2s",
              }}
            />
            <input
              type="text"
              placeholder="Search patients by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.75rem",
                borderRadius: "9999px",
                border: searchFocused
                  ? "1px solid #0d9488"
                  : "1px solid #e2e8f0",
                backgroundColor: "#fff",
                fontSize: "0.875rem",
                outline: "none",
                boxShadow: searchFocused
                  ? "0 0 0 3px rgba(13, 148, 136, 0.1)"
                  : "0 1px 2px 0 rgba(0,0,0,0.02)",
                transition: "all 0.2s",
                color: "#0f172a",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* New Patient Button opening Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              background: btnHover
                ? "linear-gradient(to right, #0f4d4a, #0d3b39)"
                : "linear-gradient(to right, #115e59, #0f4d4a)",
              color: "white",
              padding: "0.625rem 1.5rem",
              borderRadius: "9999px",
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
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <Plus size={18} strokeWidth={2.5} />
            New Patient
          </button>
        </div>

        {/* Patients List Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "1rem",
          }}
        >
          {/* List Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 2fr 1.5fr 1.5fr 2fr 50px",
              gap: "1rem",
              padding: "0 1.5rem 0.75rem 1.5rem",
              color: "#94a3b8",
              fontSize: "0.75rem",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <div></div> {/* Empty for Avatar */}
            <div>Name</div>
            <div>ID Number</div>
            <div>Date of Birth</div>
            <div>Address</div>
            <div style={{ textAlign: "right" }}>Actions</div>
          </div>

          {/* List Rows from State */}
          <div>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <PatientRow
                  key={patient.idNumber}
                  patient={patient}
                  index={index}
                  onSelect={onPatientSelect}
                />
              ))
            ) : (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  color: "#94a3b8",
                  fontStyle: "italic",
                }}
              >
                No patients found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* Pagination Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 0",
            color: "#64748b",
            fontSize: "0.875rem",
          }}
        >
          <div>
            Showing 1 to {filteredPatients.length} of {patients.length} results
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#64748b",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                color: "#64748b",
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </main>

      {/* Embedded Modal */}
      <NewPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePatient}
        patientCount={patients.length}
      />
    </div>
  );
}
