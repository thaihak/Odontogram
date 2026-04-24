import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  ClipboardList,
  Image as ImageIcon,
  Stethoscope,
  ChevronDown as SelectIcon,
  Activity,
  FileText,
  AlertCircle,
  Trash2,
} from "lucide-react";

// --- Procedure Catalog ---
const procedureCatalog = [
  {
    category: "Endodontics",
    items: [
      {
        code: "D3310",
        name: "Root Canal Treatment (Anterior)",
        khmer: "ព្យាបាលឫសធ្មេញមុខ",
        time: "60min",
        price: "$350.00",
      },
      {
        code: "D3320",
        name: "Root Canal Treatment (Premolar)",
        khmer: "ព្យាបាលឫសធ្មេញមុនថ្គាម",
        time: "75min",
        price: "$450.00",
      },
      {
        code: "D3330",
        name: "Root Canal Treatment (Molar)",
        khmer: "ព្យាបាលឫសធ្មេញថ្គាម",
        time: "90min",
        price: "$600.00",
      },
    ],
  },
  {
    category: "Examination",
    items: [
      {
        code: "D0120",
        name: "Periodic Oral Evaluation",
        khmer: "ការពិនិត្យមាត់ទៀងទាត់",
        time: "15min",
        price: "$15.00",
      },
      {
        code: "D0140",
        name: "Limited Oral Evaluation",
        khmer: "ការពិនិត្យមាត់មានកម្រិត",
        time: "15min",
        price: "$20.00",
      },
      {
        code: "D0150",
        name: "Comprehensive Oral Evaluation",
        khmer: "ការពិនិត្យមាត់ទូលំទូលាយ",
        time: "30min",
        price: "$35.00",
      },
    ],
  },
  {
    category: "Imaging",
    items: [
      {
        code: "D0210",
        name: "Full Mouth Radiographs (FMX)",
        khmer: "ថតកាំរស្មី X ពេញមាត់",
        time: "20min",
        price: "$80.00",
      },
      {
        code: "D0220",
        name: "Periapical Radiograph",
        khmer: "ថតកាំរស្មី X ជុំវិញចុងឫស",
        time: "5min",
        price: "$15.00",
      },
      {
        code: "D0272",
        name: "Bitewing Radiographs",
        khmer: "ថតកាំរស្មី X ខាំស្លាប",
        time: "10min",
        price: "$25.00",
      },
      {
        code: "D0330",
        name: "Panoramic Radiograph",
        khmer: "ថតកាំរស្មី X វិលជុំ",
        time: "10min",
        price: "$60.00",
      },
    ],
  },
  {
    category: "Orthodontics",
    items: [
      {
        code: "D8080",
        name: "Comprehensive Ortho (Adolescent)",
        khmer: "ការតម្រឹមធ្មេញ វ័យក្មេង",
        time: "60min",
        price: "$3000.00",
      },
      {
        code: "D8090",
        name: "Comprehensive Ortho (Adult)",
        khmer: "ការតម្រឹមធ្មេញ មនុស្សពេញវ័យ",
        time: "60min",
        price: "$3500.00",
      },
    ],
  },
  {
    category: "Other",
    items: [
      {
        code: "D9110",
        name: "Emergency Treatment (Palliative)",
        khmer: "ព្យាបាលបន្ទាន់",
        time: "20min",
        price: "$50.00",
      },
      {
        code: "D9230",
        name: "Nitrous Oxide Analgesia",
        khmer: "ថ្នាំស្ពឹកក្លិន N2O",
        time: "15min",
        price: "$40.00",
      },
      {
        code: "D9944",
        name: "Occlusal Guard (Night Guard)",
        khmer: "ឧបករណ៍ការពារពេលយប់",
        time: "30min",
        price: "$250.00",
      },
      {
        code: "D9972",
        name: "External Bleaching (Whitening)",
        khmer: "បំភ្លឺធ្មេញ ក្នុង១ជួរ",
        time: "45min",
        price: "$150.00",
      },
    ],
  },
  {
    category: "Pediatric",
    items: [
      {
        code: "D1120",
        name: "Prophylaxis (Child)",
        khmer: "សម្អាតធ្មេញក្មេង",
        time: "20min",
        price: "$35.00",
      },
      {
        code: "D1351",
        name: "Dental Sealant (per tooth)",
        khmer: "បិទស៊ីឡង់ធ្មេញ",
        time: "10min",
        price: "$25.00",
      },
    ],
  },
  {
    category: "Periodontics",
    items: [
      {
        code: "D4341",
        name: "Scaling & Root Planing",
        khmer: "កំចាត់គ្រាប់ថ្ម ១/៤មាត់",
        time: "45min",
        price: "$120.00",
      },
      {
        code: "D4910",
        name: "Periodontal Maintenance",
        khmer: "ថែរក្សាជំងឺអញ្ចាញ",
        time: "40min",
        price: "$80.00",
      },
    ],
  },
  {
    category: "Prophylaxis",
    items: [
      {
        code: "D1110",
        name: "Prophylaxis (Adult)",
        khmer: "សម្អាតធ្មេញមនុស្សពេញវ័យ",
        time: "30min",
        price: "$50.00",
      },
      {
        code: "D1208",
        name: "Topical Fluoride Application",
        khmer: "បិទជាតិស្ពាន់ហ្វ្លួរ",
        time: "10min",
        price: "$20.00",
      },
    ],
  },
  {
    category: "Prosthodontics",
    items: [
      {
        code: "D2740",
        name: "Porcelain/Ceramic Crown",
        khmer: "មកុដសេរ៉ាមិក",
        time: "60min",
        price: "$500.00",
      },
      {
        code: "D2750",
        name: "PFM Crown",
        khmer: "មកុដផូសេឡែន-លោហៈ",
        time: "60min",
        price: "$400.00",
      },
      {
        code: "D5110",
        name: "Complete Denture (Upper)",
        khmer: "ធ្មេញក្លែងពេញ ខាងលើ",
        time: "60min",
        price: "$800.00",
      },
      {
        code: "D5120",
        name: "Complete Denture (Lower)",
        khmer: "ធ្មេញក្លែងពេញ ខាងក្រោម",
        time: "60min",
        price: "$800.00",
      },
      {
        code: "D5213",
        name: "Partial Denture (Upper)",
        khmer: "ធ្មេញក្លែងផ្នែក ខាងលើ",
        time: "45min",
        price: "$600.00",
      },
      {
        code: "D6058",
        name: "Abutment Supported Crown",
        khmer: "មកុដលើរន្ធដោត",
        time: "60min",
        price: "$700.00",
      },
      {
        code: "D6240",
        name: "Pontic (Porcelain/Ceramic)",
        khmer: "ខ្នើសរពូថ សេរ៉ាមិក",
        time: "45min",
        price: "$450.00",
      },
    ],
  },
  {
    category: "Restorations",
    items: [
      {
        code: "D2140",
        name: "Amalgam Restoration (1 Surface)",
        khmer: "ស្ដារអាម៉ាល់ហ្គាម ១ផ្ទៃ",
        time: "30min",
        price: "$60.00",
      },
      {
        code: "D2150",
        name: "Amalgam Restoration (2 Surfaces)",
        khmer: "ស្ដារអាម៉ាល់ហ្គាម ២ផ្ទៃ",
        time: "40min",
        price: "$80.00",
      },
      {
        code: "D2330",
        name: "Resin Composite (1 Surf, Anterior)",
        khmer: "ស្ដារកុំផូហ្ស៊ីត ១ផ្ទៃ មុខ",
        time: "30min",
        price: "$75.00",
      },
      {
        code: "D2331",
        name: "Resin Composite (2 Surf, Anterior)",
        khmer: "ស្ដារកុំផូហ្ស៊ីត ២ផ្ទៃ មុខ",
        time: "40min",
        price: "$100.00",
      },
      {
        code: "D2391",
        name: "Resin Composite (1 Surf, Posterior)",
        khmer: "ស្ដារកុំផូហ្ស៊ីត ១ផ្ទៃ ក្រោយ",
        time: "35min",
        price: "$85.00",
      },
      {
        code: "D2950",
        name: "Core Buildup",
        khmer: "កសាងស្នូលធ្មេញ",
        time: "30min",
        price: "$120.00",
      },
    ],
  },
  {
    category: "Surgery",
    items: [
      {
        code: "D6010",
        name: "Endosseous Implant Placement",
        khmer: "ដាក់រន្ធដោតធ្មេញ",
        time: "90min",
        price: "$1500.00",
      },
      {
        code: "D7140",
        name: "Simple Extraction",
        khmer: "ដកធ្មេញធម្មតា",
        time: "20min",
        price: "$80.00",
      },
      {
        code: "D7210",
        name: "Surgical Extraction",
        khmer: "ដកធ្មេញវះកាត់",
        time: "45min",
        price: "$150.00",
      },
      {
        code: "D7240",
        name: "Impacted Tooth Removal",
        khmer: "ដកធ្មេញជាប់",
        time: "45min",
        price: "$200.00",
      },
      {
        code: "D7510",
        name: "Incision & Drainage of Abscess",
        khmer: "កាត់បង្ហូរពពោង",
        time: "30min",
        price: "$100.00",
      },
    ],
  },
];

// Reusable UI Components
const Card = ({ children, className = "", style = {} }) => (
  <div className={`card ${className}`} style={style}>
    {children}
  </div>
);

const TextAreaField = ({ label, placeholder, minHeight = "80px" }) => (
  <div className="textarea-field">
    <label className="textarea-label">{label}</label>
    <textarea
      className="textarea-input"
      style={{ minHeight }}
      placeholder={placeholder}
    />
  </div>
);

// Main Application Component
export default function App({ patient, onBack, onOpenOdontogram }) {
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [isSelectFocused, setIsSelectFocused] = useState(false);

  const handleAddProcedure = (e) => {
    const code = e.target.value;
    if (!code) return;

    let foundProc = null;
    for (const category of procedureCatalog) {
      const item = category.items.find((i) => i.code === code);
      if (item) {
        foundProc = item;
        break;
      }
    }

    if (foundProc) {
      setSelectedProcedures((prev) => [
        ...prev,
        { ...foundProc, id: Date.now() + Math.random() },
      ]);
    }
    e.target.value = ""; // Reset after selection
  };

  const handleRemoveProcedure = (idToRemove) => {
    setSelectedProcedures((prev) => prev.filter((p) => p.id !== idToRemove));
  };

  const totalPrice = selectedProcedures.reduce((sum, proc) => {
    return sum + parseFloat(proc.price.replace("$", ""));
  }, 0);

  return (
    <div className="app-container">
      {/* Header (Fixed) */}
      <header className="app-header">
        <div className="header-group">
          {onBack && (
            <button className="btn-back" onClick={onBack}>
              <ArrowLeft className="icon-sm" />
              Back
            </button>
          )}
          <div className="header-divider"></div>
          <h1 className="header-title">
            Dental Encounter{" "}
            <span className="header-subtitle">
              — {patient?.name || "Unknown Patient"}
            </span>
          </h1>
        </div>
        <div className="header-group">
          <button className="btn-save">
            <Save className="icon-sm" />
            Save
          </button>
          <button className="btn-complete">
            <CheckCircle className="icon-sm" />
            Sign & Complete
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="main-content">
        {/* Column 1: Clinical Notes */}
        <Card className="col-notes">
          <div className="col-notes-header">
            <div className="col-notes-title">
              <ClipboardList className="icon-md text-gray" />
              <h2>Clinical Notes</h2>
            </div>
          </div>

          <div className="notes-scroll-area">
            {/* Chief Complaint */}
            <div className="section-container">
              <h3 className="section-header">
                <ClipboardList className="icon-sm text-teal" /> Chief Complaint
                & History
              </h3>
              <div className="section-body">
                <TextAreaField
                  label="Chief Complaint"
                  placeholder="Patient's primary reason for visit..."
                  minHeight="80px"
                />
                <TextAreaField
                  label="Medical / Dental History"
                  placeholder="Relevant medical conditions, allergies, past dental work..."
                  minHeight="100px"
                />
              </div>
            </div>

            {/* Examination */}
            <div className="section-container">
              <h3 className="section-header">
                <Activity className="icon-sm text-teal" /> Clinical Examination
              </h3>
              <div className="section-body">
                <TextAreaField
                  label="Extraoral Examination"
                  placeholder="TMJ, lymph nodes, facial symmetry..."
                  minHeight="60px"
                />
                <TextAreaField
                  label="Intraoral - Soft Tissue"
                  placeholder="Mucosa, tongue, floor of mouth, palate..."
                  minHeight="60px"
                />
                <TextAreaField
                  label="Intraoral - Hard Tissue"
                  placeholder="Detailed intraoral findings, existing restorations..."
                  minHeight="80px"
                />
                <div className="grid-2">
                  <TextAreaField
                    label="Occlusion"
                    placeholder="Class I/II/III..."
                    minHeight="60px"
                  />
                  <TextAreaField
                    label="Hygiene"
                    placeholder="Plaque, calculus..."
                    minHeight="60px"
                  />
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="section-container">
              <h3 className="section-header">
                <FileText className="icon-sm text-teal" /> Diagnosis
              </h3>
              <div className="section-body section-body-last">
                <TextAreaField
                  label="Diagnosis Summary"
                  placeholder="List of current diagnoses..."
                  minHeight="100px"
                />
                <TextAreaField
                  label="Caries Risk Assessment"
                  placeholder="Low / Moderate / High with reasoning..."
                  minHeight="60px"
                />
                <div className="alert-box">
                  <AlertCircle className="icon-md text-amber" />
                  <p className="alert-text">
                    Ensure all diagnoses align with the documented intraoral
                    examination.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Column 2: Interactive Charting & Expanding Procedures */}
        <div
          className="col-interactive"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <Card className="card-odontogram">
            <div className="odontogram-header">
              <Stethoscope className="icon-md text-dark" strokeWidth={2} />
              <h2 className="odontogram-title">Odontogram</h2>
            </div>
            <div className="odontogram-content">
              <div className="tooth-graphic-container">
                <img
                  src="/normal-img/Frame.png"
                  alt="Dental chart"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <p className="odontogram-desc">
                Interactive multi-view dental chart with surface-level condition
                mapping
              </p>
            </div>
            <button className="btn-open-chart" onClick={onOpenOdontogram}>
              <Stethoscope className="icon-md" />
              Open Odontogram
            </button>
          </Card>

          {/* EXPANDING PROCEDURE CARD */}
          <Card
            className="card-procedures"
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              height: "fit-content", // Allows natural expansion
              minHeight: "250px",
              transition: "all 0.3s ease",
            }}
          >
            <div
              className="proc-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <h2 className="proc-title" style={{ margin: 0 }}>
                Procedures Performed
              </h2>
              <span
                className="proc-badge"
                style={{
                  background: "#e0f2fe",
                  color: "#0284c7",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                {selectedProcedures.length} items
              </span>
            </div>

            {/* Enhanced Select Dropdown */}
            <div
              className="select-container"
              style={{ position: "relative", marginBottom: "16px" }}
            >
              <select
                defaultValue=""
                className="select-input"
                onChange={handleAddProcedure}
                onFocus={() => setIsSelectFocused(true)}
                onBlur={() => setIsSelectFocused(false)}
                style={{
                  width: "100%",
                  padding: "14px 40px 14px 16px", // Extra right padding for the icon
                  borderRadius: "8px",
                  border: isSelectFocused
                    ? "2px solid #0284c7"
                    : "1px solid #d1d5db",
                  outline: "none",
                  appearance: "none",
                  backgroundColor: "#ffffff",
                  color: "#1f2937",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                  boxShadow: isSelectFocused
                    ? "0 0 0 3px rgba(2, 132, 199, 0.15)"
                    : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <option value="" disabled style={{ color: "#9ca3af" }}>
                  Search and add procedure (e.g. D1110)...
                </option>
                {procedureCatalog.map((category) => (
                  <optgroup
                    key={category.category}
                    label={category.category}
                    style={{
                      color: "#6b7280",
                      fontStyle: "normal",
                      fontWeight: "600",
                    }}
                  >
                    {category.items.map((item) => (
                      <option
                        key={item.code}
                        value={item.code}
                        style={{
                          color: "#111827",
                          fontWeight: "normal",
                          padding: "8px",
                        }}
                      >
                        {item.code} - {item.name} ({item.price})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <SelectIcon
                className="icon-sm select-icon"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: isSelectFocused ? "#0284c7" : "#9ca3af",
                  pointerEvents: "none",
                  transition: "color 0.2s ease-in-out",
                }}
              />
            </div>

            {/* Expanding List Area (No Internal Scroll) */}
            <div
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              {selectedProcedures.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 1rem",
                    color: "#9ca3af",
                    border: "2px dashed #e5e7eb",
                    borderRadius: "8px",
                    backgroundColor: "#f9fafb",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    No procedures logged for today's encounter.
                  </p>
                </div>
              ) : (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {selectedProcedures.map((proc) => (
                    <li
                      key={proc.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "14px",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <strong
                          style={{ color: "#111827", fontSize: "0.95rem" }}
                        >
                          {proc.code} - {proc.name}
                        </strong>
                        <span style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                          {proc.khmer} • {proc.time} •{" "}
                          <span style={{ color: "#059669", fontWeight: "600" }}>
                            {proc.price}
                          </span>
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveProcedure(proc.id)}
                        title="Remove Procedure"
                        style={{
                          background: "#fee2e2",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "6px",
                          transition: "background-color 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fca5a5")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fee2e2")
                        }
                      >
                        <Trash2 className="icon-sm" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Total Footer */}
            {selectedProcedures.length > 0 && (
              <div
                style={{
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: "2px solid #e5e7eb",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontWeight: "600",
                    color: "#4b5563",
                    fontSize: "1.05rem",
                  }}
                >
                  Total Estimate:
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                    color: "#059669",
                  }}
                >
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* Column 3: Reference & Planning */}
        <div className="col-reference">
          <Card className="card-half">
            <div className="panel-header">
              <div className="panel-title-wrapper">
                <ImageIcon className="icon-md text-gray" />
                <h2 className="panel-title">Dental Images</h2>
              </div>
              <button className="link-upload">Upload</button>
            </div>
            <div className="tabs-scroll">
              <button className="tab-button active">All</button>
              <button className="tab-button">PA</button>
              <button className="tab-button">BW</button>
              <button className="tab-button">OPG</button>
            </div>
            <div className="empty-images">
              <ImageIcon className="icon-lg text-light" strokeWidth={1.5} />
              <p className="empty-images-text">No images</p>
            </div>
          </Card>

          <Card className="card-half plan-card">
            <div className="panel-header">
              <div className="panel-title-wrapper">
                <FileText className="icon-md text-gray" />
                <h2 className="panel-title">Treatment Plan</h2>
              </div>
            </div>
            <div className="plan-container">
              <textarea
                className="plan-textarea"
                placeholder="Outline the proposed treatment plan, phases, and notes for the front desk..."
              />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
